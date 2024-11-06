// services/userService.js
const User = require('../models/user');

// 1. 사용자 정보 조회
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password'); // 비밀번호 제외
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    return user;
  } catch (error) {
    throw new Error(`사용자 정보 조회 실패: ${error.message}`);
  }
};

// 2. 사용자 정보 수정
const updateUser = async (userId, updateData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 전달된 데이터로 사용자 정보 업데이트
    if (updateData.name) user.name = updateData.name;
    if (updateData.profileIcon) user.profileIcon = updateData.profileIcon;

    await user.save();
    return user;
  } catch (error) {
    throw new Error(`사용자 정보 수정 실패: ${error.message}`);
  }
};

// 3. 사용자 삭제
const deleteUserById = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    return user;
  } catch (error) {
    throw new Error(`회원 탈퇴 실패: ${error.message}`);
  }
};

module.exports = {
  getUserById,
  updateUser,
  deleteUserById,
};

/*userService.js 파일은 사용자 정보의 CRUD 작업을 수행하는 서비스로, userController에서 호출되어 데이터베이스와 상호작용합니다. 이 파일에서 사용자 정보 조회, 수정, 삭제 등의 로직을 정의합니다.

 15번 작업: userService.js 파일 구성

 구현할 주요 기능
1. 사용자 정보 조회: 사용자 ID를 사용하여 데이터베이스에서 사용자 정보를 조회합니다.
2. 사용자 정보 수정: 사용자 이름, 프로필 이미지 등 주요 정보를 업데이트합니다.
3. 사용자 삭제: 데이터베이스에서 사용자를 삭제하고 관련 정보를 정리합니다.


 기능 설명

1. 사용자 정보 조회 (getUserById)
   - 사용자 ID를 통해 데이터베이스에서 사용자 정보를 조회하고, 비밀번호를 제외한 나머지 정보를 반환합니다.
   - 조회 실패 시 에러 메시지를 반환하여 호출 측에서 이를 처리할 수 있게 합니다.

2. 사용자 정보 수정 (updateUser)
   - 사용자 ID와 수정할 데이터를 입력받아 사용자의 이름이나 프로필 아이콘 등을 업데이트합니다.
   - 업데이트 후 저장된 사용자 정보를 반환합니다.

3. 사용자 삭제 (deleteUserById)
   - 사용자 ID를 통해 데이터베이스에서 사용자를 삭제합니다.
   - 삭제된 사용자 정보를 반환하거나, 삭제 실패 시 에러를 발생시킵니다.

 추가 설명
- 에러 처리: 각 메서드에서 발생한 에러를 명확한 메시지로 반환하여, 호출하는 컨트롤러에서 적절히 처리할 수 있게 합니다.
- 데이터 검증: 필요한 경우, updateData를 사용해 전달받은 값만 업데이트하여 안정성을 확보합니다.

이제 userService.js에서 사용자 정보의 CRUD 로직을 명확하게 정의하고 userController와 연결할 수 있습니다.*/