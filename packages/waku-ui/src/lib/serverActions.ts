"use server";

import { unstable_redirect } from "waku/router/server";
import { unstable_getHeaders as getHeaders } from "waku/server";

export async function modifyMetadata(data: FormData) {
  const username = data.get("username") as string;
  const hash = data.get("hash") as string;
  const visibility = data.get("visibility") as string;
  //   const filename = data.get("filename") as string;
  const headers = getHeaders();
  const referer = new URL(headers.referer ?? "/").pathname;

  console.log({ username, hash, visibility });

  const res = await fetch(`http://localhost:34997/m/${username}/${hash}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ visibility }),
  }).then((res) => res.json());
  console.log(res);
  return unstable_redirect(referer);
}

export async function deleteFile(data: FormData) {
  const username = data.get("username") as string;
  const hash = data.get("hash") as string;
  const headers = getHeaders();
  const referer = new URL(headers.referer ?? "/").pathname;

  await fetch(`http://localhost:34997/${username}/${hash}`, {
    method: "DELETE",
  });

  return unstable_redirect(referer);
}

export async function storeFile(data: FormData) {
  try {
    const response = await fetch("http://localhost:34997/store", {
      method: "POST",
      body: data,
    });

    // TODO handle this nicely
    if (response.ok) {
      console.log("File uploaded successfully");
      return { success: "File uploaded successfully" };
      // Handle success (e.g., show a success message)
    } else {
      console.log(await response.text());
      console.error("File upload failed");
      return { error: "File upload failed" };
      // Handle error (e.g., show an error message)
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: "Error uploading file" };
    // Handle error (e.g., show an error message)
  }
}

export async function storeFileOld(data: File, metadata: any) {
  try {
    const formData = new FormData();
    formData.append("data", data);
    formData.append("metadata", JSON.stringify(metadata));

    const response = await fetch("http://localhost:34997/store", {
      method: "POST",
      body: formData,
    });

    // TODO handle this nicely
    if (response.ok) {
      console.log("File uploaded successfully");
      return { success: "File uploaded successfully" };
      // Handle success (e.g., show a success message)
    } else {
      console.log(await response.text());
      console.error("File upload failed");
      return { error: "File upload failed" };
      // Handle error (e.g., show an error message)
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: "Error uploading file" };
    // Handle error (e.g., show an error message)
  }
}
