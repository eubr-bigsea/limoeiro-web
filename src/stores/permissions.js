import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permissions', {
  state: () => ({
    permissions: [],
  }),
  actions: {
    setPermissions(perms) {
      this.permissions = perms
    },
    hasPermission(perms) {
      return perms.some(v => this.permissions.map(p => p.id).includes(v))
    },
  },
})
