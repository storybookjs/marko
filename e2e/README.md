# E2E Tests

## E2E tests vs Examples

Goal: extract the examples from the storybook monorepo, to make it more lightweight and remove friction to contributing.

By extracting all (but 1 -or a few-) examples into their own repo we can get a few nice benefits:
 - examples become clonable, and can serve as a boilerplate to get users started
 - examples become much easier to find for users searching
 - the monorepo becomes lightweight, cloning and bootstrapping becomes faster, and less prone to problems on less-beefy developerment-machines.
 - a lightweight monorepo might also reduce CI time

In order to do this we need to:

 - extract the examples
 - setup CI for each example
 - setup a script in the monorepo to be able to inject the examples into the /examples/ dir before the yarn phase.
 
add a toggle-able list of examples in the yarn bootstrap command, so we're still able to un all the example we currently can.
- keep official example only, all other examples get "deleted"
- move official example to the root
- script all frameworks examples from their cli
- build cli scripted example
- host it locally & run cypress on it
- create example repos that are the product of framework-cli + storybook-cli
- each example repo self updates every 24h

## Folder structure

```
e2e/
  |-- angular/  
  |      |-- xxx.ts
  |      |
  |      
  |-- cra/  
  |-- utils/
        |-- command.ts
  
```

## E2E Tests

E2E steps:

- checkout ✅
- install ✅
- bootstrap ✅
- local registry
- publish
- framework cli
- storybook cli
- static build
- host static build
- cypress
