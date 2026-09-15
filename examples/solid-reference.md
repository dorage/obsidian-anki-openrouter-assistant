<!-- plan: SRP I+P+F, ISP I+P+F, LSP I+P+R, OCP I+P+F, DIP I+P+F, D: OCP-vs-DIP, D: LSP-vs-SRP·ISP, 불변식 R+D, 공통명제 R -->

START
Basic
[OOP]
```java
class Employee {
    private int hoursWorked, hourlyRate;

    int    calculatePay() { return hoursWorked * hourlyRate; }
    String reportHours()  { return "총 " + hoursWorked + "시간"; }
    void   save()         { db.execute("UPDATE employee SET ..."); }
}
```
들어온 요청: 재무팀장 "초과근무 수당 계산식 변경", 인사팀장 "리포트에 부서명 추가", DBA "스키마 변경으로 쿼리 수정".

다섯 원칙 중 무엇을 어기는가? 근거는 어느 줄인가?
Back: SRP

근거: 세 요청이 각각 `calculatePay` / `reportHours` / `save`에 닿아, 이 파일 하나가 세 명의 요청자 때문에 수정된다.
정의: 하나의 모듈은 하나의 액터(변경을 요구하는 주체)에 대해서만 책임진다.
ISP가 아닌 이유: 쓰지 않는 메서드에 의존하도록 강요받는 클라이언트가 없다. 문제는 인터페이스가 아니라 한 클래스가 여러 액터를 섬기는 것이다.
Tags: oop::solid::srp
END

START
Basic
[OOP] `Employee`의 `calculatePay`와 `reportHours`가 헬퍼 `billableHours() = Math.min(hoursWorked, 40)`을 함께 쓴다.

재무팀 요청으로 40시간 상한을 없애 `return hoursWorked;`로 바꾸고 배포했다. `hoursWorked = 50`인 직원의 인사팀 월간 리포트 문자열은 배포 전과 후에 각각 무엇인가? 이 변화를 요청한 팀은?
Back: 전 "총 40시간" / 후 "총 50시간". 요청한 팀은 재무팀.

`reportHours`는 손대지 않았지만 공유 헬퍼의 상한이 사라져 반환값이 바뀐다. 요청한 쪽과 값이 바뀐 쪽이 다르다.
Tags: oop::solid::srp
END

START
Basic
[OOP] `Employee`(calculatePay / reportHours / save, 두 메서드가 공유하는 헬퍼 billableHours)를
재무팀 요청이 인사팀 리포트 값을 바꾸지 않도록 SRP에 맞게 재구성하라. 어떤 단위로 나누고, 재무팀 요청은 어느 단위만 열게 되는가?
Back: 액터별로 분리 — `EmployeeData` / `PayCalculator` / `HourReporter` / `EmployeeRepository`. 재무팀 요청은 `PayCalculator`만 연다.

판정 기준:
- 재무팀 요청으로 열리는 단위가 하나뿐인가
- `reportHours`와 `calculatePay`가 더 이상 같은 헬퍼 구현을 공유하지 않는가
- 분리 기준이 기술 계층(DB, UI)이 아니라 요청자(액터)인가
Tags: oop::solid::srp
END

START
Basic
[OOP]
```java
interface Worker { void work(); void eat(); void attendMeeting(); }

class FullTimeEmployee implements Worker { /* 셋 다 구현 */ }
class RobotWorker      implements Worker {
    public void work()          { ... }
    public void eat()           { throw new UnsupportedOperationException(); }
    public void attendMeeting() { throw new UnsupportedOperationException(); }
}
```
총무팀 요청으로 `eat()`을 `eat(Allergy a)`로 바꿨더니 `RobotWorker`도 고쳐야 컴파일이 된다.

이 장면이 드러내는 위반은 다섯 원칙 중 무엇인가? 근거는 어느 줄인가?
Back: ISP

근거: `RobotWorker`는 `eat()`을 쓰지 않는데(`UnsupportedOperationException`) `Worker`를 통해 그 메서드에 의존하고 있어, 알러지와 무관한 변경에 끌려 들어간다.
정의: 클라이언트는 자신이 쓰지 않는 메서드에 의존하도록 강요받지 않는다.
LSP가 아닌 이유: LSP는 실행 중에 조용히 틀린 값이 나오느냐를 보는데, 이 장면은 실행에 도달하지 못하고 컴파일에서 걸린다.
Tags: oop::solid::isp
END

START
Basic
[OOP] `interface Worker { work(); eat(); attendMeeting(); }`를 `FullTimeEmployee`(셋 다 구현)와 `RobotWorker`(`eat`, `attendMeeting`은 예외를 던짐)가 구현한다.

`eat()`을 `eat(Allergy a)`로 바꾸고 컴파일한다. 수정이 필요한 클래스를 모두 적고, 그중 알러지와 무관한 것을 표시하라.
Back: `FullTimeEmployee`, `RobotWorker`. 알러지와 무관한 것은 `RobotWorker`.

두 클래스 모두 `Worker`를 구현하므로 시그니처 변경에 컴파일이 걸린다. `RobotWorker`는 밥을 먹지 않는데도 같이 열린다.
Tags: oop::solid::isp
END

START
Basic
[OOP] `interface Worker { work(); eat(); attendMeeting(); }`를 `FullTimeEmployee`와 `RobotWorker`가 구현한다.

`eat()`의 시그니처 변경이 `RobotWorker`에 닿지 않도록 ISP에 맞게 재구성하라. 인터페이스를 어떻게 나누고, `RobotWorker`는 무엇을 구현하는가?
Back: `Workable` / `Eatable` / `Attendable`로 쪼갠다. `RobotWorker`는 `Workable`만 구현한다.

판정 기준:
- `RobotWorker`가 구현하는 인터페이스에 `eat`이 없는가
- `eat()` 시그니처를 바꿨을 때 컴파일이 걸리는 클래스가 `FullTimeEmployee`뿐인가
- `RobotWorker`에 `UnsupportedOperationException`을 던지는 메서드가 남지 않는가
Tags: oop::solid::isp
END

START
Basic
[OOP]
```java
class Rectangle {
    protected int width, height;
    void setWidth(int w)  { this.width  = w; }
    void setHeight(int h) { this.height = h; }
    int  area()           { return width * height; }
}
class Square extends Rectangle {
    @Override void setWidth(int w)  { this.width = w; this.height = w; }
    @Override void setHeight(int h) { this.width = h; this.height = h; }
}
void testArea(Rectangle r) { r.setWidth(5); r.setHeight(4); assert r.area() == 20; }
```
`testArea(new Rectangle())`은 통과하고 `testArea(new Square())`는 실패한다.

다섯 원칙 중 무엇을 어기는가? 위반의 근거는 어느 줄이며, 위반의 주체는 무엇인가?
Back: LSP

근거: `Square.setHeight`가 `width`까지 덮어써서, "한 변만 바꾸고 다른 변은 건드리지 않는다"는 `Rectangle`의 규약을 항상 깬다.
정의: 상위 타입 자리에 하위 타입을 넣어도 프로그램의 정확성이 깨지지 않아야 한다.
위반의 주체는 `Square` 단독이 아니라 `Rectangle` 자리에 놓인 치환 관계다. `Square` 코드 자체에는 버그가 없다.
OCP가 아닌 이유: 기존 코드를 한 줄도 수정하지 않았다. `Square`는 수정이 아니라 규약을 깨는 케이스를 만들어 낸 것이다.
Tags: oop::solid::lsp
END

START
Basic
[OOP] `Square extends Rectangle`에서 `setWidth(w)`와 `setHeight(h)`가 각각 두 변을 모두 같은 값으로 만든다.

`testArea(Rectangle r) { r.setWidth(5); r.setHeight(4); assert r.area() == 20; }`에 `new Square()`를 넣으면, 두 호출 뒤의 `(width, height)`와 `area()`의 값은 각각 무엇인가? 사라진 값은?
Back: `setWidth(5)` 후 (5, 5), `setHeight(4)` 후 (4, 4), `area()` = 16. 사라진 것은 `width = 5`.

컴파일은 통과하고 실행 중에 조용히 틀린 값이 나온다.
Tags: oop::solid::lsp
END

START
Cloze
[LSP] {{c1::상위}} 타입 자리에 {{c1::하위}} 타입을 넣어도 프로그램의 정확성이 깨지지 않아야 한다.
Back Extra: `Rectangle` 자리에 `Square`를 넣으면 `setWidth(5); setHeight(4)` 뒤 `area()`가 20이 아니라 16이다. 판정 대상은 클래스 하나가 아니라 치환 관계다.
Tags: oop::solid::lsp
END

START
Basic
[OOP]
```java
double totalArea(List<Object> shapes) {
    for (Object s : shapes) {
        if (s instanceof Rectangle)   sum += ...;
        else if (s instanceof Circle) sum += ...;
    }
}
```
기획 요청: "삼각형 추가". 이어서 "사다리꼴도".

다섯 원칙 중 무엇을 어기는가? 근거는 어느 줄인가?
Back: OCP

근거: `instanceof` 사슬 때문에 도형이 하나 늘 때마다 기존 `totalArea`를 열어 조건식을 추가해야 한다. 확장이 곧 수정이다.
정의: 확장에는 열려 있고 수정에는 닫혀 있어야 한다.
Tags: oop::solid::ocp
END

START
Basic
[OOP] `totalArea`가 `instanceof` if 사슬로 `Rectangle`, `Circle`의 면적을 더한다.

기획이 삼각형을, 이어서 사다리꼴을 추가해 달라고 했다. 새로 만드는 파일 수와 기존 파일을 수정하는 횟수는 각각 몇인가?
Back: 신규 파일 2개 / 기존 파일 수정 2회

도형마다 클래스 파일 하나가 새로 생기고, 그때마다 `totalArea`의 if 사슬에 조건식을 추가한다. 같은 작업이 도형 수만큼 반복된다.
Tags: oop::solid::ocp
END

START
Basic
[OOP] `totalArea`가 `instanceof` if 사슬로 도형별 면적 공식을 직접 들고 있다.

새 도형이 추가돼도 `totalArea`를 수정하지 않도록 OCP에 맞게 재구성하라. 무엇을 도입하고, 면적 공식은 어디로 가며, `totalArea`는 어떻게 되는가?
Back: `interface Shape { double area(); }`를 도입하고 각 도형이 `area()`를 구현한다. `totalArea`는 `sum += s.area();` 한 줄이 된다.

판정 기준:
- 새 도형을 추가할 때 기존 파일 수정 횟수가 0인가
- 면적 공식이 `totalArea`가 아니라 각 도형 구현체에 있는가
- `totalArea`에 `instanceof`가 남아 있지 않은가
Tags: oop::solid::ocp
END

START
Basic
[OOP]
```java
class OrderService {
    private MySqlOrderRepository repo = new MySqlOrderRepository();
    void placeOrder(Order o) { validate(o); repo.save(o); }
}
```
인프라팀 요청: "MongoDB로 교체". QA팀 요청: "DB 없이 `validate`만 테스트".

다섯 원칙 중 무엇을 어기는가? 근거가 되는 부분은 그 줄의 어디인가?
Back: DIP

근거: `= new MySqlOrderRepository()` — 상위 모듈 `OrderService`가 자기 협력자를 구체 타입으로 직접 만든다. 그래서 DB 교체와 테스트 모두 `OrderService`를 고쳐야 한다.
정의: 상위 수준 모듈이 하위 수준 모듈에 의존하지 않고, 둘 다 추상에 의존한다.
Tags: oop::solid::dip
END

START
Basic
[OOP] `OrderService`가 `private MySqlOrderRepository repo = new MySqlOrderRepository();`로 저장소를 들고 있다.

인프라팀이 MongoDB 교체를, QA팀이 DB 없이 `validate`만 테스트하기를 요청했다. 각 요청에서 `OrderService`에 어떤 수정이 생기는가?
Back: 교체: `repo`의 타입 변경. 테스트: 운영 클래스에 테스트용 저장소 필드를 추가하게 된다.

두 요청 모두 `OrderService`를 연다. 특히 테스트를 위해 운영 코드를 고치게 되는 것이 문제다.
Tags: oop::solid::dip
END

START
Basic
[OOP] `OrderService`가 `= new MySqlOrderRepository()`로 저장소를 직접 만든다.

DB 교체와 테스트에서 `OrderService`가 수정되지 않도록 DIP에 맞게 재구성하라. 무엇을 도입하고, MySQL이라는 구체 정보는 어디로 가며, 저장소는 언제 어떻게 들어오는가?
Back: 추상 `OrderRepository`를 두고 `MySqlOrderRepository`가 구현한다. `OrderService`는 추상 타입만 들고, 저장소는 생성 시점에 주입된다 — `new OrderService(new MongoOrderRepository())`.

판정 기준:
- `OrderService` 안에 구체 저장소의 `new`가 없는가
- `OrderService`의 필드 타입이 추상인가
- 테스트용 저장소를 운영 코드 수정 없이 넣을 수 있는가
Tags: oop::solid::dip
END

START
Basic
[OOP] 두 후보: OCP, DIP.

`AreaCalculator`가 `instanceof` 사슬로 `Rectangle`, `Circle`을 직접 지목하던 것을 `interface Shape { double area(); }`로 바꿔, 의존이 `AreaCalculator → Shape ← Rectangle, Circle, Triangle` 모양이 되었다.

"기획이 삼각형을 추가해도 `AreaCalculator`는 한 글자도 바뀌지 않는다"는 이 그림의 어느 원칙에 대한 진술인가?
Back: OCP

구별 시험: 문장이 "새 요구가 와도 기존 코드를 수정하지 않는다"를 말하면 OCP, "양쪽이 구체가 아니라 추상에 의존한다"는 화살표 모양을 말하면 DIP. 같은 그림이 두 원칙의 근거가 되지만 이 문장은 수정 여부를 말하고 있다.
Tags: oop::solid::ocp
END

START
Basic
[OOP] 두 후보: (가) SRP·ISP처럼 "수정될 때 같이 흔들리는가"를 보는 원칙, (나) LSP처럼 "실행 중에 조용히 틀린 값이 나오는가"를 보는 원칙.

장면: 기존 코드는 한 글자도 수정하지 않았고 컴파일도 통과했는데, 새 하위 클래스를 기존 자리에 넣자 테스트가 실패한다.

어느 쪽 원칙이 다루는 장면인가?
Back: (나) LSP

구별 시험: 기존 코드 수정 횟수가 0인가. 0이면 "변경의 전파"가 아니라 치환이 규약을 깬 것이다.
Tags: oop::solid
END

START
Cloze
[불변식] 불변식(invariant)은 {{c1::어떤 시점에도 참이어야 하는 상태에 대한 명제}}이며, 참/거짓을 따지려면 {{c2::값}}이 있어야 한다.
Back Extra: `Rectangle`의 "`setHeight(h)` 뒤에도 `width`는 직전 값을 유지한다"는 실행 중 값으로 판정되는 불변식이다. 메서드 시그니처는 상태가 아니라 타입 선언이므로 불변식이 아니다.
Tags: oop::solid::invariant
END

START
Basic
[OOP] 두 후보: 불변식 위반 / 불변식이 아닌 다른 종류의 약속 위반.

장면 A: `Square`에 `setHeight(4)`를 호출하자 `width`가 5에서 4로 바뀌었다.
장면 B: `eat()`을 `eat(Allergy a)`로 바꾸자 `RobotWorker`가 컴파일되지 않는다.

각 장면은 어느 쪽인가?
Back: A는 불변식 위반, B는 불변식이 아닌 약속 위반

구별 시험: 실행 중 값으로 참/거짓이 갈리는가. A는 실행 중 `width` 값이 규약을 어긴다. B는 타입 선언의 문제라 컴파일러가 실행 전에 잡고 끝나며, 실행에 도달하지 못한다.
Tags: oop::solid::invariant
END

START
Cloze
[SOLID 공통점] 다섯 원칙이 공통으로 하는 일은 {{c1::잘못된 의존을 해체}}하고, {{c2::수정하거나 작성하지 않은 쪽}}에 문제가 생기는 것을 막는 것이다.
Back Extra: "변경의 전파를 막는다"로는 LSP가 빠진다(기존 코드 수정 0회인데 손대지 않은 `testArea`가 깨진다). 의존이 사라지는 것이 아니라, ISP·DIP·OCP는 가리키는 대상이, SRP는 쏘는 쪽이 바뀌고, LSP는 그 자리에 들어올 수 있는 것이 제한된다.
Tags: oop::solid
END
