// weather update client in node.js
// connects SUB socket to tcp://localhost:5556
// collects weather updates and finds avg temp in zipcode
// Referenence : https://zguide.zeromq.org/docs/chapter1/#Getting-the-Message-Out

/* -------- pub-sub 패턴 -----------*/

const { exit } = require("process");
const zmq = require("zeromq");

console.log("Collecting updates from weather server...");

// sub를 수행하기 위한 소켓을 만든다.
const subscriber = zmq.socket("sub");

// subscribe할 필터를 정한다.
// 프로그램을 시작할때 숫자를 주면 해당 숫자를 구독하고, 그렇지않다면 10001을 구독하게 한다.
let filter = null;
if (process.argv.length > 2) {
  filter = process.argv[2];
} else {
  filter = "10001";
}
console.log(filter);
// subscribe("topic")을 통해 subscribe를 수행한다.
// 이떄 publisher로 부터온 문자열 중 지정해준 topic으로 시작하는 경우만 데이터를 받는다.
// topic을 지정하고 싶지 않다면 '' 로 주게되면 publisher가 보내는 모든 정보를 받게된다.
subscriber.subscribe(filter);

// process 20 updates
let total_temp = 0,
  temps = 0;

// sub 에 메시지가 도착한 것을 감지하는 event listener
// 메시지가 도착했으면 콜백함수를 수행한다.
// 이때 subscirber.filter 로 zipcode를 넣어주었는데,
// 해당 zipcode가 응답에 들어있는 경우만 메시지를 받아 callback 함수가 수행된다.
subscriber.on("message", (data) => {
  let pieces = data.toString().split(" "),
    zipcode = parseInt(pieces[0], 10),
    temperature = parseInt(pieces[1], 10),
    relhumidity = parseInt(pieces[2], 10);

  console.log(
    "Receive temperature for zipcode '",
    zipcode,
    "' was ",
    temperature,
    " F"
  );

  temps += 1;
  total_temp += temperature;

  // 5번 올때까지 출력한다.
  if (temps === 5) {
    console.log(
      [
        "Average temperature for zipcode '",
        filter,
        "' was ",
        (total_temp / temps).toFixed(2),
        " F",
      ].join("")
    );
    exit(1);
  }
});

// 서버가 동작하고 있는 address에 연결한다.
subscriber.connect("tcp://localhost:5556");
