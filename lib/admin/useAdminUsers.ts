"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createAdminUser as createAdminUserRequest,
  loadAdminUsers,
  removeAdminUser as removeAdminUserRequest,
  updateAdminAccess as updateAdminAccessRequest,
} from "@/lib/admin/users";
import type { AdminSection, AdminUser } from "@/lib/admin/types";

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    const loaded = await loadAdminUsers();
    setUsers(loaded);
    setIsReady(true);
    return loaded;
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadAdminUsers().then((loaded) => {
      if (!cancelled) {
        setUsers(loaded);
        setIsReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const createUser = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      sections: AdminSection[];
      accessUntil?: string | null;
    }) => {
      await createAdminUserRequest(input);
      await refresh();
    },
    [refresh]
  );

  const updateAccess = useCallback(
    async (id: string, input: { sections: AdminSection[]; accessUntil: string | null }) => {
      await updateAdminAccessRequest(id, input);
      await refresh();
    },
    [refresh]
  );

  const removeUser = useCallback(
    async (id: string) => {
      await removeAdminUserRequest(id);
      await refresh();
    },
    [refresh]
  );

  return { users, isReady, createUser, updateAccess, removeUser };
}
