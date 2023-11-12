import axios from "axios";
import { isUser } from "../../src/models/UserEntity";
import * as testUtils from "./mongoTestUtils";

describe("unit", () => {
    describe("userAPI", () => {

        const USER_URL = "http://localhost:8080/users";
 
        beforeEach(async () => {
            await testUtils.clearDB();
        });

        const testUser = {
            username: "testUsername", 
            password: "testPassword",
            email: "testEmail@gmail.com"
        }
        
        describe("Signup", () => {
            it("Should save a new user into the db when successfully", async () => {
                const createUser = await axios.post(USER_URL + "/signup", testUser);

                expect(createUser.status).toBe(200);
                expect(isUser(createUser.data)).toBe(true);
            })

            it("Should return statusCode 409 and errorMessage when username is already taken",async () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const createUser = await axios.post(USER_URL + "/signup", testUser);
                const createUser2 = await axios.post(USER_URL + "/signup", testUser)
                .catch( err => {
                    expect(err.response.status).toBe(409);
                    expect(err.response.data).toEqual({ error: "Username already taken" });
                });

                expect(createUser2).toBe(undefined);
            });
        });

        describe("Login", () => {
            it("Should return login user when successfully",async  () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const createUser = await axios.post(USER_URL + "/signup", testUser);
                const logInUser = await axios.post(USER_URL + "/login", {username: 'testUsername', password: 'testPassword'});

                expect(logInUser.status).toBe(200);
                expect(logInUser.data).toEqual(createUser.data);
            }, 10000);

            it("Should fail when credentials don't match a saved user",async () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const createUser = await axios.post(USER_URL + "/signup", testUser);
                const logInUser = await axios.post(USER_URL + "/login", {username: 'test', password: 'testPassword'}).catch(
                    err => {
                        expect(err.response.status).toBe(401);
                        expect(err.response.data).toEqual({error: "Unauthorized"});
                    }
                );

                expect(logInUser).toBe(undefined);
            });
        });

        describe("/logout", () => {
            it("Should return success message when user logs out", async () => {
                const createNewUser = await axios.post(USER_URL + "/signup", testUser);

                const logIn = await axios.post(USER_URL + "/login", {username: "testUsername", password: "testPassword"}, {
                    withCredentials: true
                });
                
                const logout = await axios.post(USER_URL + "/logout", {}, {
                    withCredentials: true
                })

                expect(logout.status).toBe(200);
                expect(logout.data).toEqual({ success: "User logged out!"});
            });
        });
    });
});
