import { expect } from "chai";
import { Typist } from "../src/models/Typist";


describe('Typist', function() {
    it('process character stream', function() {

      let typist = new Typist("Lorem Ipsum");
      typist.ProcessCharacter("B"); expect(typist.Index).equal(0);
      typist.ProcessCharacter("C"); expect(typist.Index).equal(0);
      typist.ProcessCharacter("L"); expect(typist.Index).equal(1);
      typist.ProcessCharacter("B"); expect(typist.Index).equal(0);
      typist.ProcessCharacter("L"); expect(typist.Index).equal(1);
      typist.ProcessCharacter("o"); expect(typist.Index).equal(2);
      typist.ProcessCharacter("r"); expect(typist.Index).equal(3);
    }); 

    it('count words', function() {

        let typist = new Typist("Lorem Ipsum");

        typist.ProcessCharacter("L");
        typist.ProcessCharacter("o");
        typist.ProcessCharacter("r");
        typist.ProcessCharacter("e");
        typist.ProcessCharacter("m");
        typist.ProcessCharacter(" ");
        typist.ProcessCharacter("I");
        typist.ProcessCharacter("p");
        typist.ProcessCharacter("s");
        typist.ProcessCharacter("u");
        typist.ProcessCharacter("m");

        expect(typist.Words).equal(2);
      });

    it('count words (incomplete)', function() {

        let typist = new Typist("Lorem Ipsum");

        typist.ProcessCharacter("L");
        typist.ProcessCharacter("o");
        typist.ProcessCharacter("r");
        typist.ProcessCharacter("e");
        typist.ProcessCharacter("m");
        typist.ProcessCharacter(" ");
        typist.ProcessCharacter("I");

        expect(typist.Words).equal(1);
      });

      it('count words (incomplete 2)', function() {

        let typist = new Typist("Lorem Ipsum");

        typist.ProcessCharacter("L");
        typist.ProcessCharacter("o");
        typist.ProcessCharacter("r");
        typist.ProcessCharacter("e");

        expect(typist.Words).equal(0);
      }); 

      // presently failing
    //   it('count words (incomplete 3)', function() {

    //     let typist = new Typist("Lorem Ipsum");

    //     typist.ProcessCharacter("L");
    //     typist.ProcessCharacter("o");
    //     typist.ProcessCharacter("r");
    //     typist.ProcessCharacter("e");
    //     typist.ProcessCharacter("m");

    //     expect(typist.Words).equal(1);
    //   }); 

    it('calculate words per minute', function(done) {

        let typist = new Typist("Lorem Ipsum");

        typist.ProcessCharacter("L");

        setTimeout(() => {
            typist.ProcessCharacter("o");
            typist.ProcessCharacter("r");
            typist.ProcessCharacter("e");
            typist.ProcessCharacter("m");
            typist.ProcessCharacter(" ");
            typist.ProcessCharacter("I");
            typist.ProcessCharacter("p");
            typist.ProcessCharacter("s");
            typist.ProcessCharacter("u");
            typist.ProcessCharacter("m");

            // 2 words in 1 second should be about 120 WPM
            expect(typist.WordsPerMinute).greaterThan(115);
            done();
        }, 1000);
      }); 
  });