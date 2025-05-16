import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permissions', {
  state: () => ({
    permissions: [],
  }),
  actions: {
    setPermissions(perms) {
      this.permissions = perms
    },
    hasPermission(perm) {
      return this.permissions.map((p) => (p.id)).includes(perm)
    },
  },
})
