import { expect } from "chai";
import { Typist } from "../src/typist";

describe('Typist', function() {
    it('process character stream', function() {

      let typist = new Typist("Lorem Ipsum");
      typist.ProcessCharacter("B"); expect(typist.Position).equal(0);
      typist.ProcessCharacter("C"); expect(typist.Position).equal(0);
      typist.ProcessCharacter("L"); expect(typist.Position).equal(1);
      typist.ProcessCharacter("B"); expect(typist.Position).equal(0);
      typist.ProcessCharacter("L"); expect(typist.Position).equal(1);
      typist.ProcessCharacter("o"); expect(typist.Position).equal(2);
      typist.ProcessCharacter("r"); expect(typist.Position).equal(3);
    }); 
  });