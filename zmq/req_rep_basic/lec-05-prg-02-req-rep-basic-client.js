// Hello World client
// Connects REQ socket to tcp://localhost:5555
// Sends "Hello" to server.
// Referenence : https://zguide.zeromq.org/docs/chapter1/#Ask-and-Ye-Shall-Receive

/* -------- req-rep 패턴 -----------*/

const zmq = require("zeromq");

// socket to talk to server
console.log("Connecting to hello world server...");

// 요청(req)을 위한 소켓을 만든다.
const requester = zmq.socket("req");

let x = 0;

// rep 에 메시지가 도착한 것을 감지하는 event listener
// 메시지가 도착했으면 콜백함수를 수행한다.
requester.on("message", (reply) => {
  console.log("Received reply", x, ": [", reply.toString(), "]");
  x += 1;
  if (x === 10) {
    // x가 10 이 되었으면 소켓을 닫고 프로세스를 종료한다.
    requester.close();
    process.exit(0);
  }
});

// 서버가 동작하고 있는 address에 연결한다.
requester.connect("tcp://localhost:5555");

// req 를 통해 연결된 res에게 요청을 보낸다.
for (let i = 0; i < 10; i++) {
  console.log("Sending request", i, "...");
  requester.send("Hello");
}

// 프로세스에서 Ctrl+C(프로세스 종료 요청)를 누르면 수행된다.
// SIGINT는 프로세스 종료 명령인 Ctrl+C를 입력받았을때 생성되는 시그널.
process.on("SIGINT", function () {
  requester.close();
});
