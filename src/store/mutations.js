export default {
    addManageStudentCount(state, payload) {
        state.manage.studentCount = payload.studentCount;
    },
    saveSearchStudentInfo(state, payload) {
        state.searchStudent = payload.searchStudent;
    }
}
