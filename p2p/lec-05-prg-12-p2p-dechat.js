const zmq = require("zeromq");
const ip = require("ip"); // ip 주소를 얻기 위해서 사용.
const { exit } = require("process");

let isConnected = null;

/* 로컬에서 nameserver가 동작하고 있는지 찾는 함수*/
const searchNameServer = async (ipMask, localIpAddress, portNameserver) => {
  // node는 비동기처리 기반이기 때문에, 작업이 모두 끝난뒤 결과를 return 하기 위해 promise를 사용한다.
  return new Promise((resolve) => {
    // 특정 주소에 위치할 것이라 생각되는 비콘서버에 connect(subscribe)하고,
    //비콘서버가 publish 하는 장보를 받기위해 sub 사용.
    let subscriber = zmq.socket("sub");
    // NAMESERVER로 시작하는 메시지만 받도록 한다.
    subscriber.subscribe("NAMESERVER");
    let last = 1;
    // 1부터 255까지의 ipMask 를 찾아본다.
    for (last; last < 256; last++) {
      let targetIpAddr = "tcp://" + ipMask + "." + last + ":" + portNameserver;

      if (targetIpAddr !== localIpAddress || targetIpAddr === localIpAddress) {
        // targetIpAddr에 연결을 요청해본다.
        subscriber.connect(targetIpAddr);
      }
    }

    // 여러개의 연결설정을 하고, 연결이 제대로 된 것이 있어서
    // 비콘이 뿌린 데이터를 받아오는 경우에 여기로 메시자가 들어온다.
    subscriber.once("message", async (msg) => {
      let spilitList = msg.toString().split(":");

      if (spilitList[0] === "NAMESERVER") {
        // 받아온 것을 resolve를 통해 리턴한다.
        resolve(spilitList[1]);
      } else {
        resolve(null);
      }
    });

    // 비콘이 메시지를 뿌리는 것은 매 1초마다 뿌리고있다. 따라서 1초정도
    // 기다리게하고, subscriber.once("message")에 메시지가 왔다면 그곳에 온 값을 리턴하고,
    // 그렇지 않고 setTimeout 안의 콜백이 수행되었다는 것은 메시지가 안왔다는 것으로 null을 리턴해준다.
    const timeout = setTimeout(() => {
      resolve(null);
    }, 1000);
  });
};

/* 서버 역할을 하는 프로그램이 있다는 것을 알려주기 위한 서버역할을 할 수 있도록 해주는 함수 */
const beaconNameserver = (localIpAddress, portNameserver) => {
  // pub패턴을 사용한다.
  let publisher = zmq.socket("pub");
  publisher.bindSync("tcp://" + localIpAddress + ":" + portNameserver);
  console.log(
    "local p2p name server bind to tcp://" +
      localIpAddress +
      ":" +
      portNameserver
  );
  // beaconNameserver는 주변에 계속해서 네임서버가 동작하고 있음을 pub를 통해 알린다.
  // 이떄 1초에 한번씩 publish를 통해 subscriber들에게 메시지를 뿌린다.
  const sendBeaconMessage = () => {
    // 1초 뒤에 콜백함수가 수행된다.
    setTimeout(() => {
      let msg = "NAMESERVER:" + localIpAddress;
      publisher.send(msg.toString());
      sendBeaconMessage();
    }, 1000);
  };
  sendBeaconMessage();
};

/* 유저를 관리하는 서버역할을 수행할수 있도록 해주는 함수. */
const userManagerNameserver = (localIpAddress, portSubscriber) => {
  let userDb = [];

  // rep 패턴을 사용한다.
  let responder = zmq.socket("rep");

  responder.bindSync("tcp://" + localIpAddress + ":" + portSubscriber);
  console.log(
    "local p2p db server activated at tcp://" +
      localIpAddress +
      ":" +
      portSubscriber
  );

  // 메시지가 들어온 것을 감지하는 event listner
  // 이벤트가 감지되면 콜백함수가 수행된다.
  responder.on("message", (msg) => {
    let userReq = msg.toString().split(":");

    // userDb 에 유저의 정보를 넣는다.
    userDb.push(userReq);
    console.log("user registration", userReq[1], "from", userReq[0]);

    // 응답으로 ok 를 보내주어 올바르게 등록되었음을 알려준다.
    responder.send("ok");
  });
};

/* 사용자가 보낸 정보를 받아서 모든 사용자에게 뿌려주는 역할을 하는 릴레이서버*/
const relayServerNameServer = (
  localIpAddress,
  portChatPublisher,
  portChatCollector
) => {
  // 사용자가 보낸 정보를 다른 모든 사용자들에게 publish 하기 위한 소켓
  let publisher = zmq.socket("pub");
  publisher.bindSync("tcp://" + localIpAddress + ":" + portChatPublisher);

  // 사용자가 push 한 정보를 pull 하여 가져오기 위한 소켓
  let collector = zmq.socket("pull");
  collector.bindSync("tcp://" + localIpAddress + ":" + portChatCollector);

  console.log(
    "local p2p relay server activated at tcp://" +
      localIpAddress +
      ":" +
      portChatPublisher +
      " & " +
      portChatCollector
  );

  // pull 소켓에 메시지가 push 된것을 감지하는 event listner
  // call back 함수가 수행된다.
  collector.on("message", (msg) => {
    console.log("p2p-relay:<==>", msg.toString());

    // 모든 클라이언트들에게 Publisher를 통해 메시지를 보내준다.
    publisher.send("RELAY:" + msg.toString());
  });
};

const mainWork = async () => {
  let ipAddrP2pServer = "";
  const portNameserver = 9001;
  const portChatPublisher = 9002;
  const portChatCollector = 9003;
  const portSubscriber = 9004;

  const userName = process.argv[2];
  const ipAddr = ip.address();
  const tempSplit = ipAddr.split(".");
  const ipMask = tempSplit[0] + "." + tempSplit[1] + "." + tempSplit[2];

  console.log("searcing for p2p server");

  // 동작하고 있는 nameserver가 있는지 확인한다.
  const nameServerIpAddr = await searchNameServer(
    ipMask,
    ipAddr,
    portNameserver
  );

  // 네임서버로 동작하는 것을 찾지 못했을때 자신이 그 클라이언트와 서버역할을 동시에 수행한다.
  if (nameServerIpAddr === null) {
    /* 클라이언트가 서버역할을 수행할수 있도록 서버 기능을 실행시키도록 한다.*/
    ipAddrP2pServer = ipAddr;
    console.log("p2p server is not found, and p2p server mode is activated");

    // 현재 서버역할을 하는 프로그램이 있다는 것을 알리기위한 비콘 서버역할을 수행시킨다.
    beaconNameserver(ipAddr, portNameserver);
    console.log("p2p beacon server is activated");

    // subscribe한 유저를 관리하는 유저관리 서버 역할을 수행시킨다.
    userManagerNameserver(ipAddr, portSubscriber);
    console.log("p2p subscriber database server is activated");

    // 사용자들간의 정보를 주고받을 수 있도록 릴레이서버 역할을 수행시킨다.
    relayServerNameServer(ipAddr, portChatPublisher, portChatCollector);
    console.log("p2p message relay server is activated");
  } else {
    ipAddrP2pServer = nameServerIpAddr;
    console.log(
      "p2p server found at",
      ipAddrP2pServer,
      "and p2p client mode is activated."
    );
  }
  console.log("starting user registration procedure");

  // userManagerNameServer는 rep 패턴 소켓이 열려있다.
  // req로 유저 등록요청을 보내서 응답을 받도록 한다.
  let dbClient = zmq.socket("req");
  dbClient.connect("tcp://" + ipAddrP2pServer + ":" + portSubscriber);

  // 등록을 위해 정보를 보낸다.
  dbClient.send(ipAddr + ":" + userName);

  // 등록은 딱 한번만 할것이므로 on 이 아닌 once를 사용한다.
  // 메시지가 들어온 것을 감지하는 event listner
  // 이벤트가 감지되면 콜백함수가 수행된다.
  dbClient.once("message", (msg) => {
    if (msg.toString() === "ok") {
      // 결과가 ok라면 다음작업을 수행한다.
      console.log("user registration to p2p server completed");
      console.log("starting message transfer procedure");

      // 릴레이 서버로부터 정보를 받아올 sub 소켓을 만든다.
      let relayReadClient = zmq.socket("sub");

      // RELAY로 시작하는 정보만 받아오도록 필터를 설정한다.
      relayReadClient.subscribe("RELAY");
      relayReadClient.connect(
        "tcp://" + ipAddrP2pServer + ":" + portChatPublisher
      );

      // 릴레이 서버에 정보를 보낼 수 있는 push 소켓을 만든다.
      let relayWriteClient = zmq.socket("push");
      relayWriteClient.connect(
        "tcp://" + ipAddrP2pServer + ":" + portChatCollector
      );

      console.log("starting autonomous meesage transmit and receive scenario.");

      // sub 소켓에서 메시지가 들어온 것을 감지하는 event listner
      // 이벤트가 감지되면 콜백함수가 수행된다.
      relayReadClient.on("message", (msg) => {
        console.log(
          "p2p-recv::<<== ",
          msg.toString().split(":")[1],
          ":",
          msg.toString().split(":")[2]
        );
      });

      const publishMessage = () => {
        // 랜덤숫자를 보고 대략 3초에 한번씩 메시지를 보내도록 한다.(랜덤 숫자에 따라 시간이 달라질 수 있음)
        let randNum = Math.floor(Math.random() * 101);
        if (randNum < 10) {
          let msg = "(" + userName + " , " + ipAddr + " :ON)";
          console.log("p2p-send:==>>", msg);

          // push를 통해 릴레이 서버의 pull하는 곳으로 메시지를 보낸다.
          relayWriteClient.send(msg);
          setTimeout(() => {
            publishMessage();
          }, 3000);
        } else if (randNum > 90) {
          let msg = "(" + userName + " , " + ipAddr + " :OFF)";
          console.log("p2p-send:==>>", msg);

          // push를 통해 릴레이 서버의 pull하는 곳으로 메시지를 보낸다.
          relayWriteClient.send(msg);
          setTimeout(() => {
            publishMessage();
          }, 3000);
        } else {
          publishMessage();
        }
      };

      publishMessage();
    } else {
      // 결과가 ok가 아닌경우 등록에 실패했으므로 아무 메시지를 출력해주고 종료한다.
      console.log("user registration to p2p server failed");
      exit(1);
    }
  });
};

if (process.argv[2] == 1) {
  console.log("usage : `node dechat.js _user-name` .");
} else {
  console.log("starting p2p chatting program");
  mainWork(process.argv[2]);
}
