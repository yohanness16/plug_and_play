import { Hono } from 'hono';
import {app} from './auth';
import posts from './posts'
import categories from './categories';
import comments from './comments';
import reactions from './reactions';
import share from './shares';

const appRouter = new Hono();

appRouter.route('/auth', app);
appRouter.route('/posts', posts)
appRouter.route('/catagories', categories)
appRouter.route('/comments', comments)
appRouter.route('/', reactions)
appRouter.route('/share', share)





export { appRouter };
