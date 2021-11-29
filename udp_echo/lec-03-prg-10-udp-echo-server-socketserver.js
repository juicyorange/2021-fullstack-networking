var dgram = require("dgram");
const host = "127.0.0.1";
const port = 10397;
/* --------------------udp 서버 생성-------------------- */

// udp 서버에 사용될 소켓을 생성한다.
var server = dgram.createSocket("udp4");

/* --------------------리스너 함수 등록 ------------------ */

// 해당 소켓에서 에러가 확인하는 것을 감지하는 event listener를 등록한다.
// 에러가 감지되면 call back 함수가 수행된다.
server.on("error", function (error) {
  console.log("Error: " + error);
  server.close();
});

// 소켓으로부터 메시지가 들어온 것을 감지하는 event listner
// 이벤트가 들어오면 지정한 call back 함수가 호출된다.
server.on("message", function (msg, info) {
  console.log("> echoed: " + msg);

  // 메시지를 다시 클라이언트에게 전달해준다.
  server.send(msg, info.port, info.address, function (error) {
    if (error) {
      client.close();
    }
  });
});

// 소켓이 listening할 준비가 되었을떄 수행된다.
server.on("listening", function () {
  let address = server.address();
  let port = address.port;
  let family = address.family;
  let ipaddr = address.address;
  console.log("> echo-server is activated");
  console.log("Server is listening at port " + port);
  console.log("Server ip :" + ipaddr);
  console.log("Server is IP4/IP6 : " + family);
});

// 소켓이 종료되었을떄 수행한다.
server.on("close", function () {
  console.log("Socket is closed !");
});

// port와 host에 따라 bind시킨다.
// tcp에서 server.listen을 하는 과정과 유사하다 볼 수 있다.
server.bind({ port, address: host });
