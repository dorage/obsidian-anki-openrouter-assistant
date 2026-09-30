<!-- plan: SRP def×2+I+P+F, ISP def×2+I+P+F, LSP def×2+I+P, OCP def×2+I+F, DIP def×2+I+P+F, D: OCP-vs-DIP, D: LSP-vs-ISP, 불변식 def×2+D, 공통명제 R — 29 cards -->

START
Basic
[SOLID] SRP(Single Responsibility Principle, 단일 책임 원칙)의 정의를 한 문장으로 말하라.
Back: 하나의 모듈은 하나의 액터(변경을 요구하는 주체)에 대해서만 책임진다.

채점: 뜻이 맞으면 정답.
- 책임의 단위를 "기능"이나 "일"이 아니라 변경을 요구하는 사람·집단(액터)으로 말했는가
- 한 모듈이 섬기는 액터가 하나여야 한다는 뜻이 들어 있는가
오답 예: "클래스는 한 가지 일만 해야 한다" — 액터가 빠져 있어, 한 가지 일을 두 요청자가 고치는 경우를 설명하지 못한다.
Tags: oop::solid::srp def
END

START
Basic
[SOLID] 다음 정의에 해당하는 원칙은? (후보: SRP, OCP, LSP, ISP, DIP)

하나의 모듈은 하나의 액터(변경을 요구하는 주체)에 대해서만 책임진다.
Back: SRP (Single Responsibility Principle, 단일 책임 원칙)

가르는 말: "액터" — ISP도 무언가를 작게 나누지만, ISP의 기준은 클라이언트가 쓰지 않는 메서드다.
Tags: oop::solid::srp def
END

START
Basic
[OOP]
```java
class Employee {
    private int hoursWorked, hourlyRate;
    private int billableHours() { return Math.min(hoursWorked, 40); }

    int    calculatePay() { return billableHours() * hourlyRate; }
    String reportHours()  { return "총 " + billableHours() + "시간"; }
    void   save()         { db.execute("UPDATE employee SET ..."); }
}
```
요청자: 재무팀장(수당 계산식), 인사팀장(리포트 양식), DBA(스키마 변경).

근거가 되는 줄은? 그 줄 때문에 다섯 원칙 중 어기는 원칙을 모두 적어라.
Back: SRP

근거: `private int billableHours()` — 서로 다른 요청자가 관할하는 `calculatePay`와 `reportHours`가 이 한 줄을 공유한다. 세 요청이 모두 같은 `Employee` 파일을 연다.
ISP가 아닌 이유: 쓰지 않는 메서드에 의존하도록 강요받는 클라이언트가 없다. 문제는 인터페이스가 아니라 한 클래스가 여러 요청자를 섬기는 것이다.
Tags: oop::solid::srp
END

START
Basic
[OOP] `Employee.billableHours()`는 `Math.min(hoursWorked, 40)`이다. 수당 계산 `calculatePay()`는 `billableHours() * hourlyRate`를, 인사팀 리포트 `reportHours()`는 `"총 " + billableHours() + "시간"`을 반환한다.

재무팀 요청으로 40시간 상한을 없애 `billableHours()`를 `return hoursWorked;`로 바꾸고 배포했다. `hoursWorked = 50`인 직원의 인사팀 월간 리포트 문자열은 배포 전과 후에 각각 무엇인가?
Back: 전: "총 40시간" / 후: "총 50시간"

`reportHours`는 손대지 않았지만 공유 헬퍼의 상한이 사라져 반환값이 바뀐다. 요청한 쪽은 재무팀, 값이 바뀐 쪽은 인사팀이다.
Tags: oop::solid::srp
END

START
Basic
[OOP] `Employee` 한 클래스에 수당 계산 `calculatePay`(재무팀 관할), 근무시간 리포트 `reportHours`(인사팀 관할), DB 저장 `save`(DBA 관할)가 있다. 앞의 두 메서드는 근무시간을 40시간으로 자르는 헬퍼 `billableHours()`를 함께 쓴다.

이 클래스를, 재무팀 요청이 인사팀 리포트 값을 바꾸지 않도록 SRP에 맞게 재구성하라. 무엇을 기준으로 나누고, 재무팀 요청은 어떤 책임을 가진 단위만 열게 되는가?
Back: 요청자(액터)마다 단위를 나눠, 재무팀 요청은 수당 계산을 맡은 단위 하나만 연다.

판정 기준:
- 재무팀 요청으로 열리는 단위가 하나뿐인가
- 수당 계산과 시간 리포트가 더 이상 같은 헬퍼 구현을 공유하지 않는가
- 분리 기준이 기술 계층(DB, UI)이 아니라 요청자(액터)인가

참고 구조(이름은 채점하지 않는다): `EmployeeData`(데이터만) / `PayCalculator`(재무팀) / `HourReporter`(인사팀) / `EmployeeRepository`(DBA)
Tags: oop::solid::srp fix
END

START
Basic
[SOLID] ISP(Interface Segregation Principle, 인터페이스 분리 원칙)의 정의를 한 문장으로 말하라.
Back: 클라이언트는 자신이 쓰지 않는 메서드에 의존하도록 강요받지 않는다.

채점: 뜻이 맞으면 정답.
- 주어가 인터페이스를 쓰는 쪽(클라이언트)인가
- "쓰지 않는 메서드에 대한 의존"을 금지하는 뜻이 들어 있는가
Tags: oop::solid::isp def
END

START
Basic
[SOLID] 다음 정의에 해당하는 원칙은? (후보: SRP, OCP, LSP, ISP, DIP)

클라이언트는 자신이 쓰지 않는 메서드에 의존하도록 강요받지 않는다.
Back: ISP (Interface Segregation Principle, 인터페이스 분리 원칙)

가르는 말: "쓰지 않는 메서드" — SRP도 무언가를 나누지만, SRP의 기준은 변경을 요구하는 액터다.
Tags: oop::solid::isp def
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
근거가 되는 줄은? 그 줄 때문에 다섯 원칙 중 어기는 원칙을 모두 적어라.
Back: ISP, LSP

근거: `class RobotWorker implements Worker`와 `eat()` / `attendMeeting()`의 `throw` 두 줄.
- ISP: `RobotWorker`가 쓰지 않는 `eat()`, `attendMeeting()`에 `Worker`를 통해 의존하도록 강요받는다.
- LSP: `Worker` 타입으로 `eat()`을 부르는 코드는 그 자리에 `RobotWorker`가 들어오면 실행 중 예외를 만난다.
Tags: oop::solid::isp
END

START
Basic
[OOP] `interface Worker { void work(); void eat(); void attendMeeting(); }`를 두 클래스가 구현한다. `FullTimeEmployee`는 세 메서드를 모두 구현하고, `RobotWorker`는 `work()`만 구현하며 `eat()`과 `attendMeeting()`에서는 `UnsupportedOperationException`을 던진다.

총무팀 요청으로 `eat()`을 `eat(Allergy a)`로 바꾸고 빌드했다. 구현 클래스 중에서 수정이 필요한 것을 모두 적고, 그중 알러지와 상관없는 것을 표시하라. 문제는 컴파일 시점과 실행 시점 중 언제 드러나는가?
Back: `FullTimeEmployee`, `RobotWorker` — 알러지와 무관한 것은 `RobotWorker` / 컴파일 시점

두 클래스 모두 `Worker`를 구현하므로 시그니처가 바뀌면 컴파일이 깨진다. `RobotWorker`는 밥을 먹지 않는데도 같이 열린다.
Tags: oop::solid::isp
END

START
Basic
[OOP] `interface Worker { void work(); void eat(); void attendMeeting(); }`를 사람 직원 `FullTimeEmployee`(셋 다 구현)와 `RobotWorker`(`work()`만 구현, 나머지 둘은 `UnsupportedOperationException`)가 함께 구현한다.

`eat()`의 시그니처가 바뀌어도 `RobotWorker`가 영향을 받지 않도록 ISP에 맞게 재구성하라. 인터페이스를 무엇을 기준으로 나누고, `RobotWorker`는 무엇에만 의존하게 되는가?
Back: 클라이언트가 실제로 쓰는 메서드 묶음마다 인터페이스를 나눠, `RobotWorker`는 일하기 묶음에만 의존한다.

판정 기준:
- `eat()` 시그니처를 바꿨을 때 `RobotWorker`가 컴파일 대상에 걸리지 않는가
- `RobotWorker`에 `UnsupportedOperationException`으로 채운 메서드가 하나도 남지 않는가
- 각 클래스가 자신이 쓰는 메서드에만 의존하는가

참고 구조(이름은 채점하지 않는다): `Workable` / `Eatable` / `Attendable`. `FullTimeEmployee`는 셋 다, `RobotWorker`는 `Workable`만 구현한다.
Tags: oop::solid::isp fix
END

START
Basic
[SOLID] LSP(Liskov Substitution Principle, 리스코프 치환 원칙)의 정의를 한 문장으로 말하라.
Back: 상위 타입 자리에 하위 타입을 넣어도 프로그램의 정확성이 깨지지 않아야 한다.

채점: 뜻이 맞으면 정답.
- 상위 타입이 쓰이던 자리에 하위 타입을 넣는 상황을 말했는가
- 그래도 프로그램이 올바르게 동작해야 한다는 뜻이 들어 있는가
오답 예: "하위 클래스는 상위 클래스를 상속해야 한다" — 문법 관계만 말하고, 넣었을 때 정확성이 유지되는지는 말하지 않는다.
Tags: oop::solid::lsp def
END

START
Basic
[SOLID] 다음 정의에 해당하는 원칙은? (후보: SRP, OCP, LSP, ISP, DIP)

상위 타입 자리에 하위 타입을 넣어도 프로그램의 정확성이 깨지지 않아야 한다.
Back: LSP (Liskov Substitution Principle, 리스코프 치환 원칙)
Tags: oop::solid::lsp def
END

START
Basic
[OOP]
```java
class Rectangle {
    protected int width, height;
    void setWidth(int w)  { this.width  = w; }
    void setHeight(int h) { this.height = h; }
    int area()            { return width * height; }
}
class Square extends Rectangle {
    @Override void setWidth(int w)  { this.width = w; this.height = w; }
    @Override void setHeight(int h) { this.width = h; this.height = h; }
}
void testArea(Rectangle r) { r.setWidth(5); r.setHeight(4); assertEquals(20, r.area()); }
```
근거가 되는 줄은? 그 줄 때문에 다섯 원칙 중 어기는 원칙을 모두 적어라.
Back: LSP

근거: `Square.setHeight`의 `this.width = h;`(및 `setWidth`의 `this.height = w;`) — `Rectangle`을 쓰는 코드는 "한 변을 바꾸면 다른 변은 그대로"라고 기대하는데, `Square`는 한 변을 바꿀 때 다른 변도 바꾼다.
판정 대상은 `Square` 클래스 하나가 아니라 `Rectangle` 자리에 `Square`를 넣는 치환 관계다.
Tags: oop::solid::lsp
END

START
Basic
[OOP] `Square extends Rectangle`이다. `Rectangle`의 `setWidth(w)` / `setHeight(h)`는 자기 변만 바꾸고, `Square`는 두 메서드 모두 `width`와 `height`를 같은 값으로 바꾸도록 재정의했다. `area()`는 `width * height`다.
`void testArea(Rectangle r) { r.setWidth(5); r.setHeight(4); assertEquals(20, r.area()); }`

`testArea(new Square())`를 호출한다. `setWidth(5)` 직후와 `setHeight(4)` 직후의 `(width, height)`, `area()`의 반환값, 그리고 문제가 컴파일 시점과 실행 시점 중 언제 드러나는지 적어라.
Back: (5, 5) → (4, 4), `area()` = 16 / 컴파일은 통과하고 실행 중에 `assertEquals`가 실패한다

`setHeight(4)`가 `width`까지 4로 덮어써 `width = 5`가 사라진다. `testArea(new Rectangle())`이었다면 (5, 4)로 20이 나온다.
Tags: oop::solid::lsp
END

START
Basic
[SOLID] OCP(Open-Closed Principle, 개방-폐쇄 원칙)의 정의를 한 문장으로 말하라.
Back: 확장에는 열려 있고 수정에는 닫혀 있어야 한다.

채점: 뜻이 맞으면 정답.
- 새 기능을 더할 수 있어야 한다(확장에 열림)는 뜻이 있는가
- 그때 기존 코드를 고치지 않아야 한다(수정에 닫힘)는 뜻이 있는가
Tags: oop::solid::ocp def
END

START
Basic
[SOLID] 다음 정의에 해당하는 원칙은? (후보: SRP, OCP, LSP, ISP, DIP)

확장에는 열려 있고 수정에는 닫혀 있어야 한다.
Back: OCP (Open-Closed Principle, 개방-폐쇄 원칙)
Tags: oop::solid::ocp def
END

START
Basic
[OOP]
```java
double totalArea(List<Object> shapes) {
    double sum = 0;
    for (Object s : shapes) {
        if (s instanceof Rectangle)   sum += ...;
        else if (s instanceof Circle) sum += ...;
    }
    return sum;
}
```
기획 요청: "삼각형 추가해 주세요."

근거가 되는 줄은? 그 줄 때문에 다섯 원칙 중 어기는 원칙을 모두 적어라.
Back: OCP

근거: `if (s instanceof Rectangle) ... else if (s instanceof Circle)` 사슬 — 면적 합계 코드가 도형 종류를 하나하나 지목하고 공식을 직접 들고 있다.
Tags: oop::solid::ocp
END

START
Basic
[OOP] 면적 합계를 구하는 `AreaCalculator.totalArea(List<Object> shapes)`가 `if (s instanceof Rectangle) ... else if (s instanceof Circle) ...` 사슬로 도형별 면적 공식을 직접 들고 있다.

기획이 도형을 추가해도 `AreaCalculator`가 한 글자도 바뀌지 않도록 OCP에 맞게 재구성하라. 면적 공식은 누구의 책임이 되고, `AreaCalculator`는 무엇에 의존하게 되는가?
Back: 면적 공식을 각 도형이 스스로 책임지게 하고, `AreaCalculator`는 "면적을 알려 준다"는 공통 추상에만 의존한다.

판정 기준:
- 삼각형을 추가할 때 `AreaCalculator`가 한 글자도 바뀌지 않는가
- 새 도형 추가가 새 파일 작성만으로 끝나는가
- `AreaCalculator`에 `instanceof`나 구체 도형 이름이 남아 있지 않은가

참고 구조(이름은 채점하지 않는다):
```java
interface Shape { double area(); }
class Rectangle implements Shape { public double area() { return w * h; } }
double totalArea(List<Shape> shapes) { double sum = 0; for (Shape s : shapes) sum += s.area(); return sum; }
```
Tags: oop::solid::ocp fix
END

START
Basic
[SOLID] DIP(Dependency Inversion Principle, 의존성 역전 원칙)의 정의를 한 문장으로 말하라.
Back: 상위 수준 모듈이 하위 수준 모듈에 의존하지 않고, 둘 다 추상에 의존한다.

채점: 뜻이 맞으면 정답.
- 상위 모듈이 하위 모듈(구체 구현)에 직접 의존하지 않는다는 뜻이 있는가
- 상위와 하위 "둘 다" 추상에 의존한다는 뜻이 있는가
오답 예: "의존성을 주입한다" — 주입은 이 원칙을 지키는 수단 중 하나일 뿐, 정의가 아니다.
Tags: oop::solid::dip def
END

START
Basic
[SOLID] 다음 정의에 해당하는 원칙은? (후보: SRP, OCP, LSP, ISP, DIP)

상위 수준 모듈이 하위 수준 모듈에 의존하지 않고, 둘 다 추상에 의존한다.
Back: DIP (Dependency Inversion Principle, 의존성 역전 원칙)
Tags: oop::solid::dip def
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
요청자: 인프라팀(MongoDB로 교체), QA팀(DB 없이 `validate`만 테스트).

근거가 되는 줄은 어느 줄의 어느 부분인가? 그 부분 때문에 다섯 원칙 중 어기는 원칙을 모두 적어라.
Back: DIP

근거: `= new MySqlOrderRepository()` — 주문 처리라는 상위 모듈 `OrderService`가 자기 협력자를 MySQL 구체 클래스로 직접 만든다.
Tags: oop::solid::dip
END

START
Basic
[OOP] 주문 처리 클래스 `OrderService`가 필드 `private MySqlOrderRepository repo = new MySqlOrderRepository();`로 저장소를 직접 만들고, `placeOrder`는 `validate(o); repo.save(o);`를 수행한다. 생성자나 setter는 없다.

QA팀: "DB 없이 `validate`만 테스트하고 싶어요." 이 요청을 들어주려면 운영 코드 중 어느 클래스를 수정해야 하며, 그 수정은 무엇을 위한 것인가?
Back: `OrderService` — 저장소를 바깥에서 넣을 경로를 추가하기 위해 (생성자·setter 등 방법은 무관)

저장소가 필드 초기화에서 `new MySqlOrderRepository()`로 정해져 있어, 운영 클래스를 고치지 않는 표준적인 방법으로는 가짜 저장소를 넣을 수 없다.
Tags: oop::solid::dip
END

START
Basic
[OOP] 주문 처리 클래스 `OrderService`가 필드에서 `new MySqlOrderRepository()`로 저장소를 직접 만들고, `placeOrder`에서 `repo.save(o)`를 부른다.

MongoDB 교체와 DB 없는 테스트 요청이 와도 `OrderService`를 수정하지 않도록 DIP에 맞게 재구성하라. `OrderService`는 무엇에 의존하고, "어떤 DB를 쓸지"의 결정은 어디로 옮겨 가는가?
Back: `OrderService`는 저장소의 추상에만 의존하고, 어떤 구현을 쓸지는 `OrderService`를 조립하는 바깥(생성하는 쪽)이 정한다.

판정 기준:
- MongoDB 교체·테스트 요청에서 `OrderService`가 수정되지 않는가
- `OrderService` 안에 구체 저장소 클래스 이름이 남아 있지 않은가
- 구현 선택이 `OrderService` 바깥의 조립 시점에 있는가

참고 구조(이름은 채점하지 않는다):
```java
interface OrderRepository { void save(Order o); }
class OrderService {
    private final OrderRepository repo;
    OrderService(OrderRepository repo) { this.repo = repo; }
}
new OrderService(new MongoOrderRepository());
```
Tags: oop::solid::dip fix
END

START
Basic
[OOP] 두 후보: OCP, DIP.

도형 목록의 면적 합계를 구하는 `AreaCalculator`가 `instanceof` 사슬로 `Rectangle`, `Circle`을 직접 지목하던 것을 `interface Shape { double area(); }`로 바꿔, 화살표가 `AreaCalculator → Shape ← Rectangle, Circle, Triangle`이 되었다.

"기획이 삼각형을 추가해도 `AreaCalculator`는 한 글자도 바뀌지 않는다"는 이 그림의 어느 원칙에 대한 진술인가?
Back: OCP

구별 시험: 문장이 "새 요구가 와도 기존 코드를 수정하지 않는다"를 말하면 OCP, "상위·하위 모듈이 둘 다 구체가 아니라 추상에 의존한다"를 말하면 DIP. 같은 그림이 두 원칙의 근거가 되지만, 이 문장은 수정 여부를 말하고 있다.
Tags: oop::solid::ocp
END

START
Basic
[OOP] 두 후보: LSP, ISP.

하위 클래스 하나를 새로 작성해 기존 상위 타입 자리에 넣었다. 기존 파일은 한 줄도 열지 않았다. 빌드와 배포는 문제없이 끝났는데, 손대지 않은 기존 테스트 하나가 20을 기대한 자리에서 16을 받고 실패한다.

어느 원칙의 위반인가?
Back: LSP

구별 시험: 기존 코드 수정 0회로 실행 중 틀린 값이 나오면 LSP, 관련 없는 클래스까지 끌고 와 컴파일 단계에서 걸리면 ISP. (이 예제들에서의 구별 기준 — 일반 정의는 아니다)
Tags: oop::solid::lsp
END

START
Basic
[OOP] 클래스 불변식(class invariant)의 정의를 한 문장으로 말하라.
Back: 객체의 공개 메서드 호출 전후마다 참이어야 하는, 객체 상태(필드 값)에 대한 명제다.

채점: 뜻이 맞으면 정답.
- 판정 대상이 객체의 상태(필드 값)인가
- 성립 시점을 "공개 메서드 호출 전후"로 말했는가 (메서드가 실행되는 도중에는 잠시 깨질 수 있다)
오답 예: "`setHeight(h)` 호출 후에도 `width`는 직전 값을 유지한다" — 한 메서드 호출 전과 후를 잇는 관계라서 불변식이 아니라 사후조건이다.
Tags: oop::solid::invariant def
END

START
Basic
[OOP] 다음 정의에 해당하는 개념은? (후보: 불변식, 시그니처 약속)

객체의 공개 메서드 호출 전후마다 참이어야 하는, 객체 상태(필드 값)에 대한 명제다.
Back: 클래스 불변식 (class invariant)

가르는 말: "객체 상태" — 시그니처 약속은 상태가 아니라 메서드 이름·인자·반환 타입의 선언이다.
Tags: oop::solid::invariant def
END

START
Basic
[OOP] 두 후보: 불변식 위반, 시그니처 약속 위반.

`interface Worker`의 `eat()`에 `Allergy a` 인자를 추가했다. 이 인터페이스를 구현하던 `RobotWorker`(`eat()`에서 예외만 던짐)는 고치기 전까지 프로그램을 빌드할 수 없었다. 어떤 객체도 만들어지지 않았다.

`RobotWorker`가 깬 것은 어느 쪽인가?
Back: 시그니처 약속 위반

구별 시험: 실행 중 객체의 상태 값으로 참/거짓이 갈리면 불변식, 선언끼리 맞는지를 실행 전에 기계가 확인하고 끝나면 시그니처 약속이다.
Tags: oop::solid::invariant
END

START
Basic
[OOP] 다섯 SOLID 원칙이 공통으로 하는 일을 한 문장으로 말하라. LSP까지 포함되는 문장이어야 한다.
Back: 잘못된 의존을 끊어, 수정하지도 새로 작성하지도 않은 코드에서 문제가 생기지 않게 한다.

채점: 뜻이 맞으면 정답.
- "변경한 쪽이 아닌 다른 쪽이 깨지는 것을 막는다"는 뜻이 들어 있는가
- LSP도 설명되는가: `Square`를 새로 작성했을 뿐 기존 코드 수정은 0회인데 손대지 않은 `testArea`가 깨진다. "변경의 전파를 막는다"로만 쓰면 이 경우가 빠진다.
Tags: oop::solid
END
