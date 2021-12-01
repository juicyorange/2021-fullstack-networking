<div id="top"></div>

<br />
<div align="center">
<br / >
  <h1 align="center">SOCKET</h1>

</div>

<!-- ABOUT THE PROJECT -->

## 👀 SOCKET에 대하여

소켓이란 떨어져 있는 두 호스트를 연결해주는 도구로써 인터페이스의 역할을 하게되는데, 이를 이용하여 서로 데이터를 주고받을 수 있게 되는데, 이때 역할에 따라 서버 소켓, 클라이언트 소켓으로 구분할 수 있다.

`TCP`의 경우에는 node.js에서 기본적으로 제공하는 socket tcp 모듈인 [net](https://nodejs.org/api/net.html) 모듈을 이용하여 개발.

- `net` 모듈은 node.js 에서 low level tcp 를 사용할 수 있도록 도와주는 모듈이다.
- 기본적으로 내장되어있는 모듈로 별도의 설치가 필요하지 않다.

`UDP`의 경우에는 node.js에서 기본적으로 제공하는 socket tcp 모듈인 [dgram](https://nodejs.org/api/dgram.html) 모듈을 이용하여 개발.

- `dgram` 모듈은 node.js 에서 low level udp 를 사용할 수 있도록 도와주는 모듈이다.
- 기본적으로 내장되어있는 모듈로 별도의 설치가 필요하지 않다.

<p align="right">(<a href="#top">back to top</a>)</p>

<br/>

## ❄️ 예제 목록

<br/>

각 예제코드 파일은 과제설명에 명시된 대로 강의자료에 있는 것과 동일한 이름을 사용했고, 그것들을 포함한 디렉토리는 내용을 함축해서 적는대신, 앞에 예제코드의 번호를 적어놓았다.

각 링크 또는 디렉토리에 들어가면 코드, 코드에 대한 readme, 실행영상이 포함되어 있다.

각 디렉토리의 readme 파일은 `개발 결과물 소개`, `소스코드 소개`, `데모영상 소개`, `느낀점` 으로 이루어져있다.

- [01-02. TCP ECHO](https://github.com/juicyorange/2021-fullstack-networking/tree/main/socket/01_02_tcp_echo)

  - 가장 간단하게 socket tcp를 사용하여 클라이언트와 서버가 데이터를 주고받는 코드.

- [03-04. TCP ECHO COMPLETE](https://github.com/juicyorange/2021-fullstack-networking/tree/main/socket/03_04_tcp_echo_complete)

  - `01-02. TCP ECHO` 에 비해 오류처리 및 기능을 재사용 가능하도록 함수화를 진행한 코드.

- [05. TCP ECHO SOCKET SERVER](https://github.com/juicyorange/2021-fullstack-networking/tree/main/socket/05_tcp_echo_socketserver)

  - socket server 의 형태로 구현한 코드.(사용하는 `net` 모듈이 기본적으로 server의 형태로 동작하고 있어 큰 변경사항 없음)

- [06. TCP ECHO MULTITHREAD](https://github.com/juicyorange/2021-fullstack-networking/tree/main/socket/06_tcp_echo_multithread)

  - `node.js` 는 기본적으로 비동기적으로 동작하고, 이를 잘 지원하기 위해 `single thread`로 동작. 그 결과 쓰레드의 생성은 곧 프로세스의 생성을 의미하기 때문에 파이썬의 코드처럼 쓰레드화하는 것이 불가능 하다는 내용에 대한 설명.

  - 추가적으로 서버의 종료 방식 변경 코드.

- [07-08. TCP CHATTING](https://github.com/juicyorange/2021-fullstack-networking/tree/main/socket/07_08_tcp_chatting)
  - TCP를 활용하여 간단한 채팅 서버, 클라이언트를 통해 채팅을 할 수 있는 코드.
- [09-10. UDP ECHO SERVER AND CLIENT](https://github.com/juicyorange/2021-fullstack-networking/tree/main/socket/09_10_udp_echo)
  - UDP를 활용하여 서버와 클라이언트 사이의 연결설정 없이 소켓을 통하여 데이터를 주고받는 코드.
- [11. UDP CHAT SERVER](https://github.com/juicyorange/2021-fullstack-networking/tree/main/socket/11_udp_chatting)
  - UDP를 사용하여 서버에 연결된 클라이언트들 사이의 채팅 구현

<p align="right">(<a href="#top">back to top</a>)</p>
