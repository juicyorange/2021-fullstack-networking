// Weather update server in node.js
// Binds PUB socket to tcp://*:5556
// Publishes random weather updates
// Referenence : https://zguide.zeromq.org/docs/chapter1/#Getting-the-Message-Out

/* -------- pub-sub 패턴 -----------*/

const zmq = require("zeromq"),
  // pub를 수행하기 위한 소켓을 만든다.
  publisher = zmq.socket("pub");

// 바인드를 하는 과정에서 꼬일 수 있으므로 차례대로 바인드 하기 위해 bindSync를 사용하여
// 동기적으로 바인드가 수행되도록 한다.
publisher.bindSync("tcp://*:5556");
publisher.bindSync("ipc://weather.ipc");

// zipcode의 5자리 중 앞부분이 비면 0으로 채워준다.
const zeropad = (num) => {
  return num.toString().padStart(5, "0");
};

// 랜덤숫자를 생성한다.
const rand = (upper, extra) => {
  let num = Math.abs(Math.round(Math.random() * upper));
  return num + (extra || 0);
};

while (true) {
  // 랜덤하게 update값을 생성한다.
  let zipcode = rand(100000),
    temperature = rand(215, -80),
    relhumidity = rand(50, 10),
    update = `${zeropad(zipcode)} ${temperature} ${relhumidity}`;
  // 요청을 보낸 곳으로 응답을 보낸다.
  publisher.send(update);
}
