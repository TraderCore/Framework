import { TestCoreFunc } from "@trader-core/core";

TestCoreFunc();

while (true) {
	console.log("hello");
	await new Promise((resolve) => setTimeout(resolve, 1000));
}
