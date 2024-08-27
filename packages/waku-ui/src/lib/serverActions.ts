"use server";

import { unstable_redirect } from "waku/router/server";
import { unstable_getHeaders as getHeaders } from "waku/server";
import { DatabaseMetadata, DatabaseMetadataSchema } from "./types";

export async function modifyMetadata(data: FormData) {
  const username = data.get("username") as string;
  const hash = data.get("hash") as string;
  const visibility = data.get("visibility") as string;
  const filename = data.get("filename") as string;

  const headers = getHeaders();
  const referer = new URL(headers.referer ?? "/").pathname;

  const updateData: { visibility?: string; filename?: string } = {};
  if (visibility) updateData.visibility = visibility;
  if (filename) updateData.filename = filename;

  // TODO handle result somehow
  const res = await fetch(`http://localhost:34997/m/${username}/${hash}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  }).then((res) => res.json());

  console.log("refreshing", referer);

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

export interface FileUploadResponse {
  data: DatabaseMetadata | null;
  error: string | null;
}

export async function storeFileOld(
  data: File,
  metadata: any
): Promise<FileUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("data", data);
    formData.append("metadata", JSON.stringify(metadata));

    const response = await fetch("http://localhost:34997/store", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((d) => ({ data: DatabaseMetadataSchema.parse(d), error: null }))
      .catch((e) => ({ data: null, error: e.message }));

    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: "Error uploading file", data: null };
  }
}
