/* -------- pub-sub and pull-push 패턴 -----------*/

const zmq = require("zeromq");

// pub를 수행하기 위한 소켓을 만든다.
const publisher = zmq.socket("pub");

// 정보를 당겨오는 pull을 수행할 소켓을 생성한다.
const collector = zmq.socket("pull");

// publisher를 tcl://*:5556 에 바인드 시켜준다.
// 지정한 address 에 소켓을 매핑했다고 생각하면된다.
publisher.bindSync("tcp://*:5557");

// collector를 tcl://*:5558 에 바인드 시켜준다.
// 지정한 address 에 소켓을 매핑했다고 생각하면된다.
collector.bindSync("tcp://*:5558");

// pull 에 메시지가 도착한 것을 감지하는 event listener
// 메시지가 도착했으면 콜백함수를 수행한다.
collector.on("message", (data) => {
  console.log("I: publishing update ", data.toString());
  publisher.send(data.toString());
});
