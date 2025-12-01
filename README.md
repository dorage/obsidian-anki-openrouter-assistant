# Anki Card Generator

OpenRouter LLM API를 사용하여 Obsidian 노트에서 Anki 플래시카드를 자동 생성하는 플러그인입니다.

## 기능

- 현재 열린 노트에서 Anki 플래시카드 자동 생성
- [Obsidian-to-Anki](https://github.com/Pseudonium/Obsidian_to_Anki) 플러그인 형식 지원 (Basic, Cloze 카드)
- OpenRouter를 통한 다양한 LLM 모델 선택 가능

## 사용 방법

1. **설정**
   - **Settings → Anki Card Generator**로 이동
   - OpenRouter API key 입력 ([OpenRouter](https://openrouter.ai/)에서 발급)
   - 사용할 모델 선택 (기본값: `openai/gpt-4o-mini`)

2. **카드 생성**
   - Anki 카드로 만들 노트를 열기
   - Command Palette 열기 (`Cmd/Ctrl + P`)
   - `Generate Anki cards from current note` 선택
   - `anki-{파일명}.md` 파일이 같은 폴더에 생성됨

3. **Anki로 가져오기**
   - [Obsidian-to-Anki](https://github.com/Pseudonium/Obsidian_to_Anki) 플러그인 사용
   - 생성된 카드 파일을 Anki로 동기화

## 생성되는 카드 형식

### Basic 카드
```markdown
START
Basic
TCP에서 연결 신뢰성을 보장하는 메커니즘은?
Back: ACK 응답
Tags: network, tcp
END
```

### Cloze 카드
```markdown
START
Cloze
Anki는 {1:강력한} {1:암기 도구}입니다.
Tags: anki
END
```

## 설치

### 수동 설치
1. [Releases](https://github.com/your-repo/releases)에서 최신 버전 다운로드
2. `main.js`, `manifest.json`을 vault의 `.obsidian/plugins/obsidian-to-anki-assistant/` 폴더에 복사
3. Obsidian 재시작 후 **Settings → Community plugins**에서 활성화

### 개발 환경
```bash
# 의존성 설치
pnpm install

# 개발 모드 (watch)
pnpm run dev

# 프로덕션 빌드
pnpm run build
```

## 요구 사항

- Obsidian v0.15.0 이상
- OpenRouter API key
- (선택) Obsidian-to-Anki 플러그인 (Anki 동기화용)
