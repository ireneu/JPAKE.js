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
        var alice = new JPAKE('sharedPassword', 'alice', {'paramSize': 80});
        var bob = new JPAKE('sharedPassword', 'bob', {'paramSize': 80});

        var alice_1 = alice.firstStep();
        var bob_1 = bob.firstStep();

        var alice_2 = alice.secondStep(bob_1);
        var bob_2 = bob.secondStep(alice_1);

        var alice_3 = alice.thirdStep(bob_2);
        var bob_3 = bob.thirdStep(alice_2);

        assert(alice_3 === bob_3);
    });

    JPAKETestSuite.addTest('end2end with parameter size: 112', function () {
        var alice = new JPAKE('anotherSharedPassword', 'alicia', {'paramSize': 112});
        var bob = new JPAKE('anotherSharedPassword', 'bobby', {'paramSize': 112});

        var alice_1 = alice.firstStep();
        var bob_1 = bob.firstStep();

        var alice_2 = alice.secondStep(bob_1);
        var bob_2 = bob.secondStep(alice_1);

        var alice_3 = alice.thirdStep(bob_2);
        var bob_3 = bob.thirdStep(alice_2);

        assert(alice_3 === bob_3);
    });

    JPAKETestSuite.addTest('end2end with parameter size: 128', function () {
        var alice = new JPAKE('yetAnotherSharedPassword', 'alicia', {'paramSize': 128});
        var bob = new JPAKE('yetAnotherSharedPassword', 'bobby', {'paramSize': 128});

        var alice_1 = alice.firstStep();
        var bob_1 = bob.firstStep();

        var alice_2 = alice.secondStep(bob_1);
        var bob_2 = bob.secondStep(alice_1);

        var alice_3 = alice.thirdStep(bob_2);
        var bob_3 = bob.thirdStep(alice_2);

        assert(alice_3 === bob_3);
    });

    JPAKETestSuite.addTest('Unmatching shared password', function () {
        var alice = new JPAKE('aPassword', 'alicia', {'paramSize': 80});
        var bob = new JPAKE('aDifferentOne', 'bobby', {'paramSize': 80});

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
            var alice = new JPAKE('samePassword', 'me', {'paramSize': 80});
            var bob = new JPAKE('samePassword', 'me', {'paramSize': 80});

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

    JPAKETestSuite.addTest('Test custom hashers', function () {
        // SHA512 (default)
        var alice = new JPAKE('sharedPassword', 'alice', {'paramSize': 80});
        var bob = new JPAKE('sharedPassword', 'bob', {'paramSize': 80, 'keyHasher': 'sha512'});

        var alice_1 = alice.firstStep();
        var bob_1 = bob.firstStep();

        var alice_2 = alice.secondStep(bob_1);
        var bob_2 = bob.secondStep(alice_1);

        var alice_3 = alice.thirdStep(bob_2);
        var bob_3 = bob.thirdStep(alice_2);

        assert(alice_3 === bob_3);

        // SHA256
        var alice = new JPAKE('sharedPassword', 'alice', {'paramSize': 80, 'keyHasher': 'sha256'});
        var bob = new JPAKE('sharedPassword', 'bob', {'paramSize': 80, 'keyHasher': 'sha256'});

        var alice_1 = alice.firstStep();
        var bob_1 = bob.firstStep();

        var alice_2 = alice.secondStep(bob_1);
        var bob_2 = bob.secondStep(alice_1);

        var alice_3 = alice.thirdStep(bob_2);
        var bob_3 = bob.thirdStep(alice_2);

        assert(alice_3 === bob_3);
    });

    JPAKETestSuite.runTests();
}));