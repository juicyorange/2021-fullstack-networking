## 11. UDP CHAT SERVER

<br>

### 개발 결과물

- udp를 사용하여 서버에 연결된 클라이언트들 사이에 채팅을 수행한다.
- 채팅을 하는 과정에서 UDP 이므로 연결지향이 아니기 때문에 `#REG` 라는 임의의 규칙을 통해 사용자를 등록한다.

<br>

### 소스코드 소개

- 이전 `lec-03-prg-10-udp-echo-server-socketserver.js` 와 비교하여 핵심인 부분은 client를 관리하는 부분이라 생각한다.
- UDP는 연결지향이 아니므로 위에서 언급한대로 `#REG` 라는 임의의 규칙을 통해 사용자를 등록한다.

  ```js
  if (msg.toString() === "#REG") {
    // 구분할떄 address 만으로는 유일하게 식별이 불가능하기 떄문에 port 번호도 함께 저장해준다.
    clientQueue.push({ address: info.address, port: info.port });
  }
  ```

- `#DEREG`를 통해 사용자 등록을 해제한다.

  ```js
    else if (msg.toString() === "#DEREG" || msg.toString() === "quit") {
      // 목록에서 현재 메시지를 보낸 소켓의 정보와 일치하는 client index를 찾는다.
      const clinetIndex = clientQueue.findIndex(
        (item) => item.address === info.address && item.port === info.port
      );
      // 찾았다면 제거한다.
      if (exitSocket > -1) {
        clientQueue.splice(exitSocket, 1);
      }
    }
  ```

- 메시지를 보낼떄도 client 리스트 안에 있는 모든 클라이언트에게 보낸다.
  ```js
  clientQueue.map((client) => {
    server.send(msg, client.port, client.address, (err) => {});
  });
  ```

<br>

### 데모영상 소개

- udp 서버를 동작시키면 현재 udp 서버에 대한 정보를 출력한다.
- 클라이언트가 하나도 등록되지 않았는데 메시지를 전송하게 되면, 등록된 클라이언트가 없다는 메시지를 출력한다.

- 이후 클라이언트가 #REG 메시지를 통해 서버에 등록을 하면 서버의 클라이언트 리스트에 추가되고, 서버에 그 클라이언트의 소켓 정보가 출려된다.

- 1명 이상이 등록되어있을때 채팅을 보내면 정상적으로 채팅이 등록된 클라이언트 모두에게 전달된다. 이때 등록되지 않은 클라이언트에게는 메시지가 전달되지 않는다.

- 하지만 이때 등록되지 않은 사용자가 채팅을 보내면, 등록되지 않은 사용자가 메시지를 보냈다고 출력하며, 이 메시지를 다른 등록된 클라이언트들에게 전송하지 않는다.

- 클라이언트에서 #DEREG 또는 quit 메시지를 서버로 보내 연결을 종료를 하게되면, 서버에서 종료된 클라이언트에 대한 정보가 출력된다.

- 모두 연결이 해제되어도, 서버는 종료되지 않고 누군가의 연결을 계속해서 기다린다.

  <br>

### 느낀점

- #REG, #DEREG 등과 같이 나만의 프로토콜을 정의하고, 나의 프로그램에서 사용하는 것을 구현해보니 신기했다.
- UDP와 TCP의 차이에 대해 각각 채팅을 구현해봄으로써 명확하게 알 수 있었다.

  <br/>

---

#### 코드의 내용에 대한 설명은 js 파일 안에 주석으로 첨부되어있습니다.

#### 이곳에는 자세한 설명은 추가되어있지 않습니다.
