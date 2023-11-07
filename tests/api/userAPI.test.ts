import * as testUtils from "./mongoTestUtils";
import axios from "axios";

describe("unit", () => {
    describe("userAPI", () => {

        const USER_URL = "http://localhost:8080/users";
 
        beforeEach(async () => {
            await testUtils.clearDB();
        });
        
        describe("Signup", () => {
            it("Should save a new user into the db when successfully", async () => {
                const createUser = await axios.post(USER_URL + "/signup", { username: 'testUsername', password: 'testPassword' });
 
                const findUser = await axios.get(USER_URL);


                expect(createUser.status).toBe(200);
                expect(createUser.data).toEqual({ response: findUser.data.response[0] });
            })

            it("Should return statusCode 409 and errorMessage when username is already taken",async () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const createUser = await axios.post(USER_URL + "/signup", { username: 'testUsername', password: 'testPassword' });
                const createUser2 = await axios.post(USER_URL + "/signup", { username: 'testUsername', password: 'testPassword' })
                .catch( err => {
                    expect(err.response.status).toBe(409);
                    expect(err.response.data).toEqual({ message: "Username already taken" });
                });

                expect(createUser2).toBe(undefined);
            });
        });

        describe("Login", () => {
            it("Should return login user when successfully",async  () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const createUser = await axios.post(USER_URL + "/signup", { username: 'testUsername', password: 'testPassword' });
                const logInUser = await axios.post(USER_URL + "/login", {username: 'testUsername', password: 'testPassword'});

                expect(logInUser.status).toBe(200);
                expect(logInUser.data).toEqual(createUser.data);
            });

            it("Should fail when credentials don't match a saved user",async () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const createUser = await axios.post(USER_URL + "/signup", { username: 'testUsername', password: 'testPassword' });
                const logInUser = await axios.post(USER_URL + "/login", {username: 'test', password: 'testPassword'}).catch(
                    err => {
                        expect(err.response.status).toBe(401);
                        expect(err.response.data).toEqual('Unauthorized');
                    }
                );

                expect(logInUser).toBe(undefined);
            });
        });
    });
});
