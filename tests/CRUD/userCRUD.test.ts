import { UserCRUD } from "../../src/CRUD/UserCRUD";
import { RepositoryMock } from "../__mocks__/repository.mock";

describe("unit", () => {
    describe("userCRUD", () => {

        const repository = new RepositoryMock();
        const crud = new UserCRUD(repository);

        const fakeResponse = {
            id: 'testUserId',
            username: 'testUsername',
            userRole: 'testUserRole'
        }

        describe("readOne()", () => {
            it("Should return an obj with statusCode 200 and a user when runs successfully",async () => {
                repository.browseOne.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const findUser = await crud.readOne({ username: 'testUsername' });

                expect(findUser.statusCode).toBe(200);
                expect(findUser.data).toEqual({ response: fakeResponse });
            });

            it("Should return an obj with statusCode 500 and error message when a unknown error occour",async () => {
                repository.browseOne.mockImplementationOnce(() => { throw new Error("Test Error!") });
                const result = await crud.readOne({id: 'testId'});

                expect(result.statusCode).toBe(500);
                expect(result.data).toEqual({message: 'Test Error!'});
            });
        });

        describe("create()", () => {
            it("Should return an obj with statusCode 200 and a user when runs successfully",async () => {
                repository.add.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const createUser = await crud.create({ username: 'testUsername', userRole: 'testUserRole' });

                expect(createUser.statusCode).toBe(200);
                expect(createUser.data).toEqual({ response: fakeResponse });
            });

            it("Should return statusCode 400 and errorMesage when userRole is not provided", async () => {
                const createUser = await crud.create(JSON.parse(JSON.stringify({ username: 'testUsername' })));

                expect(createUser.statusCode).toBe(400);
                expect(createUser.data).toEqual({ message: 'Missing parameter userRole' })
            });
        });
    })
});