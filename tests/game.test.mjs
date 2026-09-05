import test from 'node:test';
import assert from 'node:assert/strict';
import { initialGame, guessNumber } from '../lib/game.mjs';
test('Every possible secret is reachable within the advertised midpoint budget',()=>{
 for(const [max,budget] of [[100,7],[128,8]])for(let target=1;target<=max;target++){
  let state=initialGame(max,target);
  while(!state.won){state=guessNumber(state,Math.floor((state.low+state.high)/2));assert.ok(state.low<=target&&state.high>=target);assert.ok(state.attempts.length<=budget);}
 }
});
test('Invalid, repeated and completed guesses never consume an attempt',()=>{
 const first=initialGame(100,73);
 for(const n of [0,101,NaN,1.5,Infinity])assert.throws(()=>guessNumber(first,n));
 const next=guessNumber(first,50);assert.equal(first.attempts.length,0);assert.throws(()=>guessNumber(next,50));
 assert.throws(()=>guessNumber(guessNumber(next,73),73));
});
test('Practice continues beyond the budget without losing clues',()=>{
 let state=initialGame(100,100);
 for(let n=1;n<=9;n++)state=guessNumber(state,n);
 assert.equal(state.low,10);assert.equal(state.attempts.length,9);assert.equal(guessNumber(state,100).won,true);
});
