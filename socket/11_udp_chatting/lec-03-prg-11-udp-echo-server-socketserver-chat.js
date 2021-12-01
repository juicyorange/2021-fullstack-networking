var dgram = require("dgram");
const host = "127.0.0.1";
const port = 10397;
// --------------------udp 서버 생성--------------------

// 채팅에 접속한 클라이언트들을 관리할 리스트.
const clientQueue = [];

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
  // 등록, 등록해제, 종료에 대해 받은 메시지로 구분한다.
  if (msg.toString()[0] === "#" || msg.toString() === "quit") {
    if (msg.toString() === "#REG") {
      console.log(
        "> Client registered",
        "address:",
        info.address,
        "port:",
        info.port
      );
      clientQueue.push({ address: info.address, port: info.port });
    }
    // #DEREG가 오거나 quit이 오면 관리하던 목록에서 제거해준다.
    else if (msg.toString() === "#DEREG" || msg.toString() === "quit") {
      // 연결을 끊어준다.
      const clinetIndex = clientQueue.findIndex(
        (item) => item.address === info.address && item.port === info.port
      );
      if (clinetIndex > -1) {
        console.log(
          "> client de-registered ",
          " address: ",
          clientQueue[clinetIndex].address,
          " port: ",
          clientQueue[clinetIndex].port
        );
        clientQueue.splice(clinetIndex, 1);
      }
    }
  } else {
    // 일반적인 메시지가 왔을떄 수행된다.
    if (clientQueue.length == 0) {
      console.log("> no clients to ehco");
    }
    // 등록되지 않은 주소에서 메시지가 오게되면 응답해주지 않는다.
    else if (
      clientQueue.findIndex(
        (item) => item.address == info.address && item.port == info.port
      ) < 0
    ) {
      console.log("> ignores a message from un-registerd client");
    }
    // 정상적으로 등록된 클라이언트에서 메시지가 도착했을떄
    else {
      console.log(
        "> received (" +
          msg.toString() +
          ") and echoed to " +
          clientQueue.length +
          " clients"
      );
      // client 목록에 있는 클라이언트들에게 모두 보내준다.
      clientQueue.map((client) => {
        // 메시지를 다시 클라이언트에게 전달해준다.
        server.send(msg, client.port, client.address, (err) => {
          if (err) {
            console.log("client :" + client.address + ":" + client.port + err);
          }
        });
      });
    }
  }
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
