import Koa from 'koa';
import usersRouter from './routers/users';
import postsRouter from './routers/posts';
import Router from '@koa/router';
import staticServer from 'koa-static';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

mongoose
  .connect('mongodb://127.0.0.1:27017/xingqiu', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const app = new Koa();
// 静态服务器
app.use(staticServer('public'));
// 跨域中间件
app.use(cors());
// bodyParser 中间件
app.use(bodyParser());
const port = 3000;
const router = new Router({
  prefix: '/api/v1', // 设置公共前缀
});

router.use(usersRouter.routes());
router.use(postsRouter.routes());
app.use(router.routes());

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err.stack);
    ctx.status = err.status || 500;
    ctx.body = err.message;
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});