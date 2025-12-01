다음 옵시디언 플러그인을 만들어줘.

## 목표
OpenRouter API를 이용해서 현재 보고있는 문서내에서 Anki 플래시카드 만들기.

## 작동방식

1. OpenRouter model과 api키는 settings에서 입력

2. 현재 문서를 Anki 작성규칙과 함께 LLM으로 넘긴다

3. `anki-{filename}.md 문서를 만들고 Anki 플래시카드를 생성한다.

## Open Router 호출방법

``` ts
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: '<OPENROUTER_API_KEY>',
});

const completion = await openRouter.chat.send({
  model: 'openai/gpt-4o',
  messages: [
    {
      role: 'user',
      content: 'What is the meaning of life?',
    },
  ],
  stream: false,
});

console.log(completion.choices[0].message.content);
```

## Anki 작성규칙

0. Obsidian-to-Anki 플러그인 문법 사용

- Blank 카드 작성방법
``` markdown
START
Basic
{front_side}
Back:
{back_side}
Tags: {tags}
END
```

- Cloze 카드 작성방법
``` markdown
START
Cloze
Anki는 {1:강력한} {1:암기 도구}입니다.
Tags: {tags}
END
```

1. 원자적 질문 (Atomic questions)

한 카드에 하나의 개념만
❌ "TCP의 특징을 모두 설명하시오"
✅
``` markdown
START
Basic
TCP에서 연결 신뢰성을 보장하는 메커니즘은?
Back: ACK 응답
Tags: network, tcp
END
```

2. 양방향 카드 활용

정방향:
``` markdown
START
Basic
CIDR /24의 호스트 수는?
Back: 254개
Tags: network, cidr
END
```

역방향:
``` markdown
START
Basic
254개 호스트를 위한 서브넷 마스크는?
Back: /24
Tags: network, cidr
END
```

3. 문맥 포함

``` markdown
START
Basic
[AWS VPC] 인터넷과 통신하려면 필요한 것은?
Back: Internet Gateway (IGW)
Tags: aws, vpc
END
```

``` markdown
START
Basic
[네트워크 계층] OSI 3계층의 주요 기능은?
Back: 라우팅 및 논리적 주소 지정
Tags: network, osi
END
```

4. 단계적 난이도

기초:
``` markdown
START
Basic
HTTP의 기본 포트는?
Back: 80
Tags: network, http, basic
END
```

중급:
``` markdown
START
Basic
HTTPS와 HTTP의 주요 차이는?
Back: SSL/TLS 암호화
Tags: network, https, intermediate
END
```

응용:
``` markdown
START
Basic
SSL handshake 과정 3단계는?
Back: 1) Client Hello 2) Server Hello 3) Key Exchange
Tags: network, ssl, advanced
END
```

5. 실무 중심 카드

``` markdown
START
Basic
[AWS] 비용 최적화를 위해 사용 빈도가 낮은 S3 객체에 적용할 스토리지 클래스는?
Back: S3 Infrequent Access (S3-IA) 또는 Glacier
Tags: aws, s3, cost-optimization
END
```

``` markdown
START
Basic
[네트워크 트러블슈팅] ping은 되는데 SSH 안 될 때 확인할 것은?
Back: 1) 보안그룹/방화벽 22번 포트, 2) SSH 서비스 상태
Tags: network, troubleshooting, ssh
END
```

6. 연관 개념 함께 정리

``` markdown
START
Basic
가장 많이 사용되는 DNS 서버 어플리케이션은?
Back: BIND(Berkeley Internet Name Domain)

BIND가 가장 오래되었고 기능이 풍부하다
쿠버네티스의 기본 DNS는 CoreDNS
Tags: Computer-networking-a-top-down-approach-8th, dns
END
```

7. 정리한 노트 내에서만 카드 추출

적혀있지 않은 내용을 추가하지 않는다.
