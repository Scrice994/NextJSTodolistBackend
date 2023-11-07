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
            it("Should return an obj with 200 and a user when runs successfully",async () => {
                repository.browseOne.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const findUser = await crud.readOne({ username: 'testUsername' });

                expect(findUser).toEqual(fakeResponse);
            });
        });

        describe("create()", () => {
            it("Should return an obj with 200 and a user when runs successfully",async () => {
                repository.add.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const createUser = await crud.create({ username: 'testUsername', userRole: 'testUserRole' });

                expect(createUser).toEqual(fakeResponse);
            });

            it("Should return 400 and errorMesage when userRole is not provided", async () => {
                const createUser = await crud.create(JSON.parse(JSON.stringify({ username: 'testUsername' })));
;
                expect(createUser).toEqual({ message: 'Missing parameter userRole' })
            });
        });
    })
});