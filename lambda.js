exports.handler = function (event, context) {
  console.log(event);
  context.succeed("hello " + event.name);


};
 
/* exports.handler = function (event, context) {
	context.succeed('hello world');
}; */