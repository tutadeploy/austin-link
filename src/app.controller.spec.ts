import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("form submission", () => {
    it("should reject invalid hash", () => {
      const result = appController.submitForm({
        fullName: "Test User",
        address: "123 Test St",
        city: "Test City",
        state: "TS",
        postalCode: "12345",
        email: "test@test.com",
        phone: "1234567890",
        cardName: "Test User",
        cardNumber: "4111111111111111",
        expireDate: "12/25",
        cvv: "123",
        hash: "invalid-hash",
      });
      expect(result).toEqual({ error: "Invalid hash code" });
    });
  });
});
