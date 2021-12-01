// Hello World server
// Binds REP socket to tcp://*:5555
// Expects "Hello" from client, replies with "world"
// Referenence : https://zguide.zeromq.org/docs/chapter1/#Ask-and-Ye-Shall-Receive

/* -------- req-rep 패턴 -----------*/

const zmq = require("zeromq");

// 응답(rep)을 위한 소켓을 만든다.
const responder = zmq.socket("rep");

// rep 에 메시지가 도착한 것을 감지하는 event listener
// 메시지가 도착했으면 콜백함수를 수행한다.
responder.on("message", (request) => {
  console.log("Received request: [", request.toString(), "]");

  // 1초간 기다렸다가 응답한다.
  setTimeout(() => {
    // 요청을한 req 클라이언트에게 응답을 보낸다.
    responder.send("World");
  }, 1000);
});

// rep를 tcl://*:5555 에 바인드 시켜준다.
// 지정한 address 에 소켓을 매핑했다고 생각하면된다.
responder.bind("tcp://*:5555", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on 5555...");
  }
});

// 프로세스에서 Ctrl+C(프로세스 종료 요청)를 누르면 수행된다.
// SIGINT는 프로세스 종료 명령인 Ctrl+C를 입력받았을때 생성되는 시그널.
process.on("SIGINT", () => {
  responder.close();
});
