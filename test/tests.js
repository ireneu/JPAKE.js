/*
 * JPAKE.js tests
 */

(function (root, factory) {
    if (typeof exports === "object") {
        module.exports = factory(require(".."));
    } else {
        root.JPAKETests = factory(JPAKE);
    }
}(this, function (JPAKE) {
    function assert(val, msg) {
        if (!val) throw new Error(msg || 'Assertion failed');
    }

    function TestSuite() {
        this.descriptions = [];
        this.tests = [];
    }

    TestSuite.prototype.addTest = function (description, test) {
        this.descriptions.push(description);
        this.tests.push(test);
    };

    TestSuite.prototype.runTests = function () {
        assert(this.descriptions.length === this.tests.length, 'Test the tester!');
        console.log('START TESTING...');
        for (var i = 0; i < this.tests.length; i++) {
            try {
                this.tests[i]();
                console.log('SUCCESS: ' + this.descriptions[i]);
            } catch (e) {
                console.log('FAILURE: ' + this.descriptions[i]);
            }
        }
        console.log('DONE!');
    };

    // Actual tests
    var JPAKETestSuite = new TestSuite();

    JPAKETestSuite.addTest('end2end with parameter size: 80', function () {
        var alice = new JPAKE('sharedPassword', 80, 'alice');
        var bob = new JPAKE('sharedPassword', 80, 'bob');

        var alice_1 = alice.firstStep();
        var bob_1 = bob.firstStep();

        var alice_2 = alice.secondStep(bob_1);
        var bob_2 = bob.secondStep(alice_1);

        var alice_3 = alice.thirdStep(bob_2);
        var bob_3 = bob.thirdStep(alice_2);

        assert(alice_3 === bob_3);
    });

    JPAKETestSuite.addTest('end2end with parameter size: 112', function () {
        var alice = new JPAKE('anotherSharedPassword', 112, 'alicia');
        var bob = new JPAKE('anotherSharedPassword', 112, 'bobby');

        var alice_1 = alice.firstStep();
        var bob_1 = bob.firstStep();

        var alice_2 = alice.secondStep(bob_1);
        var bob_2 = bob.secondStep(alice_1);

        var alice_3 = alice.thirdStep(bob_2);
        var bob_3 = bob.thirdStep(alice_2);

        assert(alice_3 === bob_3);
    });

    JPAKETestSuite.addTest('end2end with parameter size: 128', function () {
        var alice = new JPAKE('yetAnotherSharedPassword', 128, 'alicia');
        var bob = new JPAKE('yetAnotherSharedPassword', 128, 'bobby');

        var alice_1 = alice.firstStep();
        var bob_1 = bob.firstStep();

        var alice_2 = alice.secondStep(bob_1);
        var bob_2 = bob.secondStep(alice_1);

        var alice_3 = alice.thirdStep(bob_2);
        var bob_3 = bob.thirdStep(alice_2);

        assert(alice_3 === bob_3);
    });

    JPAKETestSuite.addTest('Unmatching shared password', function () {
        var alice = new JPAKE('aPassword', 80, 'alicia');
        var bob = new JPAKE('aDifferentOne', 80, 'bobby');

        var alice_1 = alice.firstStep();
        var bob_1 = bob.firstStep();

        var alice_2 = alice.secondStep(bob_1);
        var bob_2 = bob.secondStep(alice_1);

        var alice_3 = alice.thirdStep(bob_2);
        var bob_3 = bob.thirdStep(alice_2);

        assert(alice_3 !== bob_3);
    });

    JPAKETestSuite.addTest('Same signature name', function () {
        try {
            var alice = new JPAKE('samePassword', 80, 'me');
            var bob = new JPAKE('samePassword', 80, 'me');

            var alice_1 = alice.firstStep();
            var bob_1 = bob.firstStep();

            var alice_2 = alice.secondStep(bob_1);
            var bob_2 = bob.secondStep(alice_1);

            var alice_3 = alice.thirdStep(bob_2);
            var bob_3 = bob.thirdStep(alice_2);
        } catch (e) {
            assert(e === 'Same signer id!');
        }
    });

    JPAKETestSuite.runTests();
}));