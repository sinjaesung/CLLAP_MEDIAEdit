using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Kakao.Test.RNKakaoTest
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNKakaoTestModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNKakaoTestModule"/>.
        /// </summary>
        internal RNKakaoTestModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNKakaoTest";
            }
        }
    }
}
