import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
const ToastContainerDiv = styled.div`
  font-size: 14px;
  background-color: black;
  color: white;
`;

function TostContainer() {
  return (
    <ToastContainerDiv>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="dark"
      />
    </ToastContainerDiv>
  );
}

export default TostContainer;
