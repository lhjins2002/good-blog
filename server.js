var express = require('express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainRouter = require('./routes/main');
var blogRouter = require('./routes/blog');
var manageRouter = require('./routes/manage');
var memberRouter = require('./routes/member');
var fileuploadRouter = require("./routes/UploadRout");

var app = express();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/main', mainRouter);
app.use('/blog', blogRouter);
app.use('/manage', manageRouter);
app.use('/member', memberRouter);

app.use("/api/upload", fileuploadRouter);
app.use(express.static("./uploads"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
