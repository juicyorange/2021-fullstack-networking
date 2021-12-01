const cluster = require("cluster");
const zmq = require("zeromq");

const frontAddr = "tcp://localhost:5570";

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

function clientTask(clientId) {
  // 클라이언트는 dealer 소켓을 가지고, 서버의 router와 통신한다.
  var sock = makeASocket("dealer", clientId, frontAddr, "connect");

  var count = 0;
  var you_want_stop_count = 1000;
  var interval = setInterval(function () {
    count = count + 1;
    console.log("REP #" + count, "sent...");

    // dealer를 통해 router 로 메시지를 보낸다
    sock.send("request #" + count);

    if (count >= you_want_stop_count) {
      sock.close();
      cluster.worker.kill(); // 쓰레드를 종료시킨다.
    }
  }, 1000);

  // dealer 에 메시지가 도착한 것을 감지하는 event listener
  // 메시지가 도착했으면 콜백함수를 수행한다.
  sock.on("message", function (data) {
    console.log(sock.identity, "received:", data.toString());
  });
}

// 마스터 프로세스의 경우에 아래의 코드를 수행한다.
if (cluster.isMaster) {
  // 새로운 프로세스를 이용하여 클라이언트를 생성한다.
  cluster.fork({ TYPE: "client" });
} else {
  // master 프로세스가 아니고 type이 client인 프로세스인 경우 실행한다.
  if (process.env.TYPE === "client") {
    clientTask(process.argv[2]);
  }
}
