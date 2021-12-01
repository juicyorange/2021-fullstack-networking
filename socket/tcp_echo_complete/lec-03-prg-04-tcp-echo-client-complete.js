const net = require("net");
const readline = require("readline");
const { exit } = require("process");

const host = "127.0.0.1";
const port = 10397;

// 키보드 입력을 위한 변수
const r = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const connectToServer = (socket) => {
  socket.setEncoding("utf8");
  let input;

  // 소켓이 성공적으로 연결된 것을 감지하는 event listner
  // 이벤트가 들어오면 지정한 call back 함수가 호출된다.
  socket.on("connect", function () {
    console.log("> echo-client is activated");

    // 키보드 입력을 받는다.
    r.question("> ", (input) => {
      socket.write(input);

      // quit 문자열이 input으로 들어오면 클라이언트 쪽에서는 fin 패킷을 보내고
      // 일부 스트림(쓰기 스트림. 받는것은 가능하다)만 종료한다. half-close
      if (input === "quit") {
        socket.end();
      }
    });
  });

  // 소켓으로부터 데이터가 들어온 것을 감지하는 event listner
  // 이벤트가 들어오면 지정한 call back 함수가 호출된다.
  socket.on("data", (data) => {
    console.log("> received:", data);

    // 소켓을 종료하는 경우가 아니라면
    // 데이터를 받은 다음에 다시 보내야 하기 때문에 또 input을 받을 수 있도록 한다.
    r.question("> ", (input) => {
      socket.write(input);
      // quit 문자열이 input으로 들어오면 클라이언트 쪽에서는 fin 패킷을 보내고
      // 일부 스트림(쓰기 스트림. 받는것은 가능하다)만 종료한다. half-close
      if (input === "quit") {
        socket.end();
      }
    });
  });

  // 소켓이 완전하게 연결이 종료되었는지 감지하는 event listner
  // 이벤트가 들어오면 지정한 call back 함수가 호출된다.
  socket.on("close", () => {
    console.log("> echo-client is de-activated");
    r.close();
    exit(1);
  });
  // 해당 소켓에서 에러가 확인하는 것을 감지하는 event listener를 등록한다.
  // 에러가 감지되면 call back 함수가 수행된다.
  socket.on("error", (err) => {
    console.log("net socket error!: " + err);
  });
};

// 데이터 보내기
// 특정 socket에게 메시지를 전달한다.
// 실패시 메시지를 다시 보내도록 구현한다.
// drain 핸들러를 통해 메시지가 보내지지 않았다면 다시 보내는 작업을 수행한다.
const writeData = (socket, data) => {
  var success = socket.write(data);
  if (!success) {
    console.log("message write error. send again");
    (function (socket, data) {
      socket.once("drain", () => {
        writeData(socket, data);
      });
    })(socket, data);
  }
};

try {
  // 소켓 연결
  const client1 = net.connect({ host, port });
  connectToServer(client1);
} catch {
  console.log("create new client error");
}
