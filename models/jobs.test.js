const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

describe ("Test jobs model", function () {
    beforeEach(async function () {
        await db.query("DELETE FROM jobs");
        await db.query("ALTER SEQUENCE jobs_id_seq RESTART WITH 1");
        await db.query(
            `INSERT INTO jobs (title, salary, equity, company_handle)
            VALUES ('test1', 100, 0.1, 'c1'),
                   ('test2', 200, 0.2, 'c2'),
                   ('test3', 300, 0.3, 'c3')`
        );
        afterEach(async function () {
            await db.query("DELETE FROM jobs");
        });
    });

        


    describe ("create", function () {
        let newJob = {
            title: "test4",
            salary: 400,
            equity: 0.4,
            companyHandle: "c4"
        };

        test ("works", async function () {
            let job = await Job.create(newJob);
            expect(job).toEqual({
                id: expect.any(Number),
                ...newJob
            });

            const result = await db.query(
                `SELECT id, title, salary, equity, company_handle AS "companyHandle"
                FROM jobs
                WHERE title = 'test4'`
            );
            expect(result.rows).toEqual([
                {
                    id: expect.any(Number),
                    title: "test4",
                    salary: 400,
                    equity: 0.4,
                    companyHandle: "c4"
                }
            ]);
        });

        test ("bad request with duplicate", async function () {
            try {
                await Job.create(newJob);
                await Job.create(newJob);
                fail();
            } catch (err) {
                expect(err instanceof BadRequestError).toBeTruthy();
            }
        });
    });

    describe ("findAll", function () {
        test ("works", async function () {
            let jobs = await Job.findAll();
            expect(jobs).toEqual([
                {
                    id: expect.any(Number),
                    title: "test1",
                    salary: 100,
                    equity: 0.1,
                    companyHandle: "c1"
                },
                {
                    id: expect.any(Number),
                    title: "test2",
                    salary: 200,
                    equity: 0.2,
                    companyHandle: "c2"
                },
                {
                    id: expect.any(Number),
                    title: "test3",
                    salary: 300,
                    equity: 0.3,
                    companyHandle: "c3"
                }
            ]);
        });
    });
});

