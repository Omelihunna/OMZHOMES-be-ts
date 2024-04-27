import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import ejs from 'ejs';
import methodOverride from 'method-override';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import session, { Store, SessionOptions } from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from './models/User';
import homeRoutes from './routes/homes';
import reviewRoutes from './routes/reviews';
import userRoutes from './routes/users';
import ExpressError from './utils/ExpressError';
import DatabaseService from './Databases/DatabaseService';
import IUSer from "./models/User"


interface SessionConfig {
    store: Store;
    name: string;
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;
    cookie: {
        httpOnly: boolean;
        // secure?: boolean; // Commented out since it's optional
        expires: number;
        maxAge: number;
    };
}

class App {
    public app: express.Application;
    private readonly port: number = 4000;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeDatabase();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(): void {
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(methodOverride('_method'));
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(mongoSanitize());

        const weekInMilli = 1000 * 60 * 60 * 24 * 7;
        const store = MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/prototype',
            touchAfter: 24 * 60 * 60,
            crypto: {
                secret: 'thisshouldbeabettersecret!',
            },
        });

        store.on('error', (e) => {
            console.log('SESSION STORE ERROR', e);
        });

        const sessionConfig = {
            store,
            name: 'session',
            secret: 'thisisnotasecret',
            resave: false,
            saveUninitialized: true,
            cookie: {
                httpOnly: true,
                // secure: true, // false in development
                expires: new Date(Date.now() + weekInMilli),
                maxAge: weekInMilli,
            },
        };

        this.app.use(session(sessionConfig as SessionOptions));
        this.app.use(flash());
        this.app.use(helmet());
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser((user: any, done) => {
            done(null, user?._id);
        });
        passport.deserializeUser(User.deserializeUser());

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.locals.currentUser = req.user;
            res.locals.success = req.flash('success');
            res.locals.error = req.flash('error');
            next();
        });

        const scriptSrcUrls = ['https://stackpath.bootstrapcdn.com/', 'https://api.tiles.mapbox.com/', 'https://api.mapbox.com/', 'https://kit.fontawesome.com/', 'https://cdnjs.cloudflare.com/', 'cdn.jsdelivr.net'];
        const styleSrcUrls = ['https://stackpath.bootstrapcdn.com/', 'https://api.tiles.mapbox.com/', 'https://api.mapbox.com/', 'https://kit-free.fontawesome.com/', 'https://fonts.googleapis.com/', 'https://use.fontawesome.com/', 'http://cdn.jsdelivr.net/'];
        const connectSrcUrls = ['https://api.mapbox.com/', 'https://a.tiles.mapbox.com/', 'https://b.tiles.mapbox.com/', 'https://events.mapbox.com/'];
        const imgSrcUrls = ["'self'", 'blob:', 'data:', 'https://res.cloudinary.com/', 'https://images.unsplash.com', 'https://t3.ftcdn.net'];
        const fontSrcUrls: string[] = [];

        this.app.use(
            helmet.contentSecurityPolicy({
                directives: {
                    defaultSrc: [],
                    connectSrc: ["'self'", ...connectSrcUrls],
                    scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
                    styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
                    workerSrc: ["'self'", 'blob:'],
                    objectSrc: [],
                    imgSrc: imgSrcUrls,
                    fontSrc: ["'self'", ...fontSrcUrls],
                },
            })
        );
    }

    private initializeDatabase(): void {
        const Db = new DatabaseService
        Db.connect()
    }

    private initializeRoutes(): void {
        this.app.use('/homes', homeRoutes);
        this.app.use('/homes/:id/reviews', reviewRoutes);
        this.app.use('/', userRoutes);
        this.app.get('/', (req: Request, res: Response) => {
            res.render('home');
        });
        this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
            next(new ExpressError('Page Not Found', 404));
        });
    }

    private initializeErrorHandling(): void {
        this.app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
            const { statusCode = 500 } = err;
            if (!err.message) err.message = 'Something went wrong';
            res.status(statusCode).render('error', { err });
        });
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server is running on ${this.port}`);
        });
    }
}

const app = new App();
app.start();
