const cluster = require("cluster");
const zmq = require("zeromq");
const backAddr = "tcp://127.0.0.1:5580";
const frontAddr = "tcp://*:5570";

// 소켓을 생성하는 것이 여러번 있기 때문에 이를 함수화.
// 파라미터 : 소켓타입, 식별자, 연결할주소, 바인드 혹은 connect 여부
function makeASocket(sockType, id, addr, bindSyncOrConnect) {
  var sock = zmq.socket(sockType);
  // socket을 구분하기 위한 식별자를 정해준다.
  sock.identity = id;
  // call the function name in bindSyncOrConnect
  sock[bindSyncOrConnect](addr);
  return sock;
}

function serverTask() {
  // backserver는 dealer 소켓을 가지고, 워커들의 dealer와 통신한다.
  var backSvr = makeASocket("dealer", "back", backAddr, "bindSync");

  // dealer 에 메시지가 도착한 것을 감지하는 event listener
  // 메시지가 도착했으면 콜백함수를 수행한다.
  backSvr.on("message", function () {
    var args = Array.apply(null, arguments);
    // frontSvr로 메시지를 전송한다.
    // 클라이언트와 연결되어있다.
    frontSvr.send(args);
  });

  // frontserver는 router 소켓을 가지고, 클라이언트의 dealer와 통신한다.
  var frontSvr = makeASocket("router", "front", frontAddr, "bindSync");

  // router 에 메시지가 도착한 것을 감지하는 event listener
  // 메시지가 도착했으면 콜백함수를 수행한다.
  frontSvr.on("message", function () {
    var args = Array.apply(null, arguments); // 콜백함수의 파라미터로 넘어온 것을 모두 읽어올 수 있다.
    // backSvr로 메시지를 전송한다.
    // 워커와 연결되어있다.
    backSvr.send(args);
  });
}

function workerTask(workerId) {
  // 워커는 dealer 소켓을 가지고, 서버의 dealer와 통신한다.
  var sock = makeASocket("dealer", "worker#" + workerId, backAddr, "connect");

  console.log(sock.identity.toString(), "started");

  // dealer 에 메시지가 도착한 것을 감지하는 event listener
  // 메시지가 도착했으면 콜백함수를 수행한다.
  sock.on("message", function (identity, data) {
    console.log(
      sock.identity.toString(),
      "received",
      data.toString(),
      "from",
      identity.toString()
    );
    // 돌아온 곳으로 다시 보내기 위해 identity를 넣어서 보낸다.
    sock.send([identity, data]);
  });
}

// 마스터 프로세스의 경우에 아래의 코드를 수행한다.
if (cluster.isMaster) {
  serverTask();
  let workerCounter = 0;
  // 프로그램을 실행할때 받은 숫자만큼 워커 프로세스를 생성한다.
  for (var i = 0; i < process.argv[2]; i++) {
    workerCounter++;
    cluster.fork({ TYPE: "worker", workerCounter });
  }
}
// 마스터 프로세스가 아닌경우
else {
  // 워커 프로세스인 경우
  if (process.env.TYPE === "worker") {
    workerTask(process.env.workerCounter);
  }
}
