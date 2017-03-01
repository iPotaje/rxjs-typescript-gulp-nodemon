import { Observable, Observer, Subscription, Subject } from 'rxjs';

console.log("******************************************");
console.log("Simple example");
console.log("******************************************");

let simple_observable = Observable.of(1, 2, 3);
simple_observable.subscribe(x => console.log("1: " + x));
simple_observable.subscribe(x => console.log("2: " + x));

console.log("******************************************");
console.log("Subscription example")
console.log("******************************************");

let observable = new Observable<string>( 
  (observer: Observer<string>) => {
    observer.next("hello");
    observer.complete();
});

let subscription1 = observable.subscribe(
  x => { console.log("1: " + x); }
);

let subscription2 = observable.subscribe(
  x => { console.log("2: " + x); }
);

console.log("******************************************");
console.log("Complex example")
console.log("******************************************");

class Anunciante extends Observable<string>{
  constructor() {
    super((observer:any) => {
      observer.next(" hoooola");
    });
  }
}

class Expectador implements Observer<string>{

  private subscription:Subscription;
  
  constructor (private name:string, private canal:Anunciante) {
    this.subscription = this.canal.subscribe(
      v  => this.next(v),
      e  => this.error(e),
      () => this.complete()
    );
  }

  next(v:string) {
    console.log(`Soy ${this.name} con: ${v}`)
  }

  error(e:any){}

  complete() {}
} 

let anunciante  = new Anunciante();
let expectador1 = new Expectador('Pepe', anunciante);
let expectador2 = new Expectador('Juan', anunciante);

console.log("******************************************");
console.log("Service and Component example")
console.log("******************************************");

class Service {
  public channel:      Subject<any>;

  constructor(){
    this.channel      = new Subject<any> ();
  }

  subscribeIt(o:any):Subscription{
    return this.channel.subscribe(o);
  }
}

class Component {
  constructor(private channel:Service){
    this.channel.subscribeIt(// <= Look no { there ;)
     (v:any) => {console.log(`Desde Component: ${v}`);}
    );
  }
}

class Component2 {
  constructor(private channel:Service){
    this.channel.subscribeIt({
     next: (v:any) => {console.log(`Desde Component2: ${v}`);},
     error: (e:any) => {}
    });
  }
}

let service = new Service();
service.subscribeIt({
  next:     (v:   any) => {console.log(v)},
  complete: () => {console.log(`Finito`)}
});

let component  = new Component(service);
let component2 = new Component2(service);

service.channel.next("Comer hoy?");
service.channel.complete();

console.log("************* End ************************");