"use strict";
/*
var fn = function () {
           console.log(100);
        };
fn.a = 10;
fn.b = function () {
    console.log(123);
};
 fn.c = {
      name: "王福朋",
      year: 1988
 };
 
fn();
fn.b();
console.log(fn.a);

function f1(){
　　　　var n=999;
        nAdd = function(x){n+=x};
　　　　function f2(){
　　　　　　console.log(n);
　　　　};
　　　　
　　　　return f2;
　　}
　　
　　var result=f1();
　　nAdd(10);
　　console.log("1 result");
　　result(); // 999
　　var result2=f1();
　　console.log("1 result2");
　　result2();
　　nAdd(20);
　　f1.n=99;
　　console.log("2 result");
　　
　　result(); // 1000
　　console.log("2 result2");
　　result2();
*/　　

　　
　　class People {
        constructor(name) { //构造函数
              this.name = name;
        }
        sayName() {
              console.log(this.name);
        }
    }
    
    var p = new People("Tom");
    p.sayName();