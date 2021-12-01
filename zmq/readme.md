<div id="top"></div>

<br />
<div align="center">
<br / >
  <h1 align="center">ZMQ</h1>

</div>

<!-- ABOUT THE PROJECT -->

## 👀 ZMQ에 대하여

ZMQ는 결국에는 소켓을 이용하여 프로그래밍 하는 것으로, 기본적인 소켓 모듈을 사용하게 되면 밑바닥 부터 개발자가 구현을 해야하지만, ZMQ는 소켓을 밑에 깔고 미리 많은 사람들이 필요로 하는 다양한 기능을 미리 구현해 놓은 오픈소스 라이브러리이다.

- [공식 홈페이지](https://zeromq.org/) 에 가보면 다양한 패턴에 대해 설명이 나와있고, 그것에 대한 예제 프로그램이 있어 개발자가 원하는 패턴만 찾으면 쉽게 따라서 구현이 가능해진다.

- 패턴의 종류도 2021.11.30 기준으로 약 60개 정도로 다양한 패턴이 존재한다.

- 또한 패턴에 대해서 다양한 언어로 예제를 제공을 해주고 있어 편리하다. 하지만 100% 예제를 제공하는 것은 일부 언어기 때문에 미리 잘 살펴보고 언어를 선택할 필요가 있어보인다.

다만 ZMQ는 기본적으로 프로그래밍언어에서 제공하지 않고 있기 떄문에 추가적으로 설치하는 과정이 필요하다.

- Node.js 에서 설치하는 방법

  ```sh
  npm install zeromq@5
  ```

<p align="right">(<a href="#top">back to top</a>)</p>

<br/>

## ❄️ 예제 목록

각 예제코드 파일은 과제설명에 명시된 대로 강의자료에 있는 것과 동일한 이름을 사용했고, 그것들을 포함한 디렉토리는 내용을 함축해서 적는대신, 앞에 예제코드의 번호를 적어놓았다.

각 링크 또는 디렉토리에 들어가면 코드, 코드에 대한 readme, 실행영상이 포함되어 있다.

각 디렉토리의 readme 파일은 `개발 결과물 소개`, `소스코드 소개`, `데모영상 소개`, `느낀점` 으로 이루어져있다.

<br/>

- [01-02. ZMQ REP RES BASIC](https://github.com/juicyorange/2021-fullstack-networking/tree/main/zmq/01_02_req_rep_basic)

  - [공식 홈페이지(req-res)](https://zguide.zeromq.org/docs/chapter1/#Ask-and-Ye-Shall-Receive) 에 나와있는 가장 기본적인 패턴인 req-res 패턴을 사용한 코드.

- [03-04. ZMQ PUB SUB BASIC](https://github.com/juicyorange/2021-fullstack-networking/tree/main/zmq/03_04_pub_sub_basic)

  - [공식 홈페이지(pub-sub)](https://zguide.zeromq.org/docs/chapter1/#Getting-the-Message-Out) 에 나와있는 가장 기본적인 패턴인 sub-pub 패턴을 사용한 코드.

- [05-06. ZMQ PUB SUB WITH PIPELINE PATTERN](https://github.com/juicyorange/2021-fullstack-networking/tree/main/zmq/05_06_pub_sub_and_pull_push)

  - sub-pub 구조에 push-pull 구조를 함께 사용하여 pipeline 패턴을 사용한 코드.

- [07-08. ZMQ PUB SUB WITH PIPELINE PATTERN V2](https://github.com/juicyorange/2021-fullstack-networking/tree/main/zmq/07_08_pub_sub_and_pull_push_v2)

  - 이전의 `05-06. ZMQ PUB SUB WITH PIPELINE PATTERN` 에 비해 가독성을 높인 코드.

- [09-10. ZMQ DEALER ROUTER PATTERN](https://github.com/juicyorange/2021-fullstack-networking/tree/main/zmq/09_10_dealer_router_pattern#09-10-zmq-dealer-router-pattern)

  - [공식 홈페이지(dealer-router)](https://zguide.zeromq.org/docs/chapter3/#The-Asynchronous-Client-Server-Pattern) 에 나와있는 dealer-router 패턴을 사용한 코드.

- [11. ZMQ DEALER ROUTER ASYNC CLIENT](https://github.com/juicyorange/2021-fullstack-networking/tree/main/zmq/11_dealer_router_pattern_multi_thread_client)

  - 이전의 구현파일인 `lec-05-prg-10-dealer-router-async-client.js`를 비동기식으로 변경하는 것인데, node에서는 쓰레드를 만들면 프로세스를 만드는 것과 동일하기 때문에 구현이 불가할 것 같다는 설명한 내용 및 코드.

- [12. ZMQ DIRTY P2P](https://github.com/juicyorange/2021-fullstack-networking/tree/main/zmq/12_p2p)
  - 위에서 사용했던 pub-sub, pull-push, req-rep 패턴을 활용하여 p2p 를 구현한 코드.

<p align="right">(<a href="#top">back to top</a>)</p>
```
