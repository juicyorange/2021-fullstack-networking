/* -------- pub-sub and pull-push 패턴 -----------*/

const zmq = require("zeromq");

// sub 를 수행하기 위한 소켓을 만든다.
const subscriber = zmq.socket("sub");
// push 를 수행하여 정보를 publish 할 소켓을 만든다.
const publisher = zmq.socket("push");

// subscribe를 수행한다. 이때 topic은 모든 topic을 받기로 한다.
subscriber.subscribe("");

// node에서는 event listener가 비동기적으로 이벤트를 확인하고 있고,
// 해당 이벤트가 발생하면 각각의 콜백함수가 비동기적으로 수행된다.

// 따라서 node는 기본적으로 비동기적으로 수행되기 때문에 poll을 통해서 특정 소켓에 이벤트가 있는지 확인하고 처리하는 것을 관리해줄 필요가 없다.

// 즉, 파이썬의 예제에서는 subscriber에 날라온 데이터가 있는경우
// poll을 통해 식별하고, 메시지를 출력하는 것이 수행되고, 그렇지 않다면 랜덤숫자를 보내는 부분이 수행되는데
// node는 비동기적으로 이벤트를 listen하고 콜백함수를 수행하기 떄문에 그럴 필요가 없다.

// sub 에 메시지가 도착한 것을 감지하는 event listener
// 메시지가 도착했으면 콜백함수를 수행한다.
subscriber.on("message", (data) => {
  console.log("I: received message ", data.toString());
});

const publishMessage = () => {
  // 1초 뒤에 콜백함수가 수행된다.
  setTimeout(() => {
    let randNum = Math.floor(Math.random() * 101);
    if (randNum < 10) {
      console.log("I: sending message ", randNum);

      // push를 통해 pull 하는 곳으로 메시지를 보낸다.
      publisher.send(randNum.toString());
    }
    publishMessage();
  }, 100);
};

publishMessage();

// publisher가 동작하고 있는 address에 연결한다.
subscriber.connect("tcp://localhost:5557");
// collector가 동작하고 있는 address에 연결한다.
publisher.connect("tcp://localhost:5558");
