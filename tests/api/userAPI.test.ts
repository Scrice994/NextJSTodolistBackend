import axios from "axios";
import * as testUtils from "./utils/mongoTestUtils";

describe("unit", () => {
    describe("userAPI", () => {

        const USER_BASE_URL = "http://localhost:8080/users";
 
        beforeEach(async () => {
            await testUtils.clearDB();
        });

        const testUser = {
            username: "testUsername", 
            password: "testPassword",
            email: "testEmail@gmail.com",
            tenantId: "testTenantId"
        }

        const testUserCredentials = {
            username: "testUsername", 
            password: "testPassword",
        }
        
        describe("/signup", () => {
            it("Should return saved user from the db without password", async () => {
                const createUser = await axios.post(USER_BASE_URL + "/signup", testUser);

                expect(createUser.status).toBe(200);
                expect(createUser.data).toEqual(expect.objectContaining({
                    id: expect.any(String),
                    username: expect.any(String),
                    email: expect.any(String),
                    status: expect.any(String),
                    tenantId: expect.any(String),
                    userRole: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }));
            });
        });

        describe("/login", () => {
            it("Should return login user and cookie in header when successfully",async  () => {
                const newActiveUser = await testUtils.initializeActiveAccount();
                const { password, ...activeUSer } = newActiveUser;

                const logInUser = await axios.post(USER_BASE_URL + "/login", testUserCredentials);
                logInUser.data.createdAt = new Date(logInUser.data.createdAt);
                logInUser.data.updatedAt = new Date(logInUser.data.updatedAt);

                expect(logInUser.status).toBe(200);
                expect(logInUser.data).toEqual(activeUSer);
                expect(logInUser.headers["set-cookie"]).toBeDefined();
            });

            it("Should fail when credentials don't match a saved user",async () => {
                const createUser = await axios.post(USER_BASE_URL + "/signup", testUser);
                const logInUser = await axios.post(USER_BASE_URL + "/login", {username: 'test', password: 'testPassword'}).catch(
                    err => {
                        expect(err.response.status).toBe(401);
                        expect(err.response.data).toEqual({error: "Invalid credentials"});
                    }
                );

                expect(logInUser).toBe(undefined);
            });
        });

        describe("/logout", () => {
            it("Should return success message when user logs out", async () => {
                await testUtils.initializeActiveAccount();

                const logIn = await axios.post(USER_BASE_URL + "/login", testUserCredentials);
                
                const logout = await axios.post(USER_BASE_URL + "/logout", {}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                });

                expect(logout.status).toBe(200);
                expect(logout.data).toEqual({ success: "User logged out!" });
            });
        });

        describe("/me", () => {
            it("Should return account information when successfully", async () => {
                const createUser = await testUtils.initializeActiveAccount();
                const { email, password, ...newUser } = createUser;
                const login = await axios.post(USER_BASE_URL + "/login", testUserCredentials);
                const getAuthenticatedUser = await axios.get(USER_BASE_URL + "/me", {
                    headers: {
                        Cookie: login.headers["set-cookie"]
                    }
                });
                getAuthenticatedUser.data.createdAt = new Date(getAuthenticatedUser.data.createdAt);
                getAuthenticatedUser.data.updatedAt = new Date(getAuthenticatedUser.data.updatedAt);

                expect(getAuthenticatedUser.data).toEqual(newUser);
            });

            it("Should return error when the right cookie is not provided", async () => {
                const getAuthenticatedUser = await axios.get(USER_BASE_URL + "/me")
                .catch( err => {
                    expect(err.response.status).toBe(401);
                    expect(err.response.data).toEqual({ error: "User not authenticated" });
                });

                expect(getAuthenticatedUser).toBeUndefined();
            })
        });

        describe("/account-verification", () => {
            it("Should return the user entity with status 'Active' when runs successfully", async() => {
                const newPendingAccount = await testUtils.initializePendingAccount();
                const { user, verificationCode, token } = newPendingAccount;
                const { password, email, ...pendingUser } = user;
    
                const verifyAccount = await axios.get(USER_BASE_URL + `/account-verification?userId=${token.userId}&verificationCode=${verificationCode}`);
                verifyAccount.data.createdAt = new Date(verifyAccount.data.createdAt);
                verifyAccount.data.updatedAt = new Date(verifyAccount.data.updatedAt);

                expect(verifyAccount.data).toEqual({...pendingUser, status: "Active", updatedAt: verifyAccount.data.updatedAt });
            });

            it("I should be able to login after account verification", async () => {
                const newPendingAccount = await testUtils.initializePendingAccount();
                const { user, verificationCode, token } = newPendingAccount;
                delete user.password
    
                const verifyAccount = await axios.get(USER_BASE_URL + `/account-verification?userId=${token.userId}&verificationCode=${verificationCode}`);

                const login = await axios.post(USER_BASE_URL + "/login", testUserCredentials);
                login.data.createdAt = new Date(login.data.createdAt);

                expect(login.data).toEqual({...user, status: "Active", updatedAt: verifyAccount.data.updatedAt });
            });
        });

        describe("/change-username", () => {
            it("should return updated user with the given username", async () => {
                const createUser = await testUtils.initializeActiveAccount();
                const { email, password, ...newUser } = createUser;
                const login = await axios.post(USER_BASE_URL + "/login", testUserCredentials);
                const changeUsername = await axios.put(USER_BASE_URL + "/change-username",{ username: "updatedUsername" }, {
                    headers: {
                        Cookie: login.headers["set-cookie"]
                    }
                });
                changeUsername.data.createdAt = new Date(changeUsername.data.createdAt);
                changeUsername.data.updatedAt = new Date(changeUsername.data.updatedAt);

                expect(changeUsername.data).toEqual({ ...newUser, username: "updatedUsername", updatedAt: changeUsername.data.updatedAt });
            });
        });
    });
});
