const CLASSES = 'overflow-x-auto w-full min-w-0 max-w-full';

export const AndroidTable = () => {
  return (
    <div class={CLASSES}>
      <table>
        <thead>
          <tr>
            <th>Device Path</th>
            <th>cordova.file.*</th>
            <th>AndroidExtraFileSystems</th>
            <th align="center">Capacitor Directory</th>
            <th>
              Available with
              <br />
              requestLegacyExternalStorage
            </th>
            <th>
              Restrictions on
              <br />
              Android 11+
            </th>
            <th>Native Command</th>
            <th align="center">r/w?</th>
            <th align="center">persistent?</th>
            <th align="center">OS clears</th>
            <th align="center">private</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>file:///android_asset/</td>
            <td>applicationDirectory</td>
            <td>assets</td>
            <td align="center"></td>
            <td></td>
            <td></td>
            <td></td>
            <td align="center">r</td>
            <td align="center">N/A</td>
            <td align="center">N/A</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>/data/data/{'<app-id>'}/</td>
            <td>applicationStorageDirectory</td>
            <td>-</td>
            <td align="center"></td>
            <td></td>
            <td></td>
            <td></td>
            <td align="center">r/w</td>
            <td align="center">N/A</td>
            <td align="center">N/A</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>/data/data/{'<app-id>'}/cache</td>
            <td>cacheDirectory</td>
            <td>cache</td>
            <td align="center">CACHE</td>
            <td></td>
            <td></td>
            <td>context.getCacheDir()</td>
            <td align="center">r/w</td>
            <td align="center">Yes</td>
            <td align="center">Yes*</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>/data/data/{'<app-id>'}/files</td>
            <td>dataDirectory</td>
            <td>files</td>
            <td align="center">DATA, LIBRARY</td>
            <td></td>
            <td></td>
            <td>context.getFilesDir()</td>
            <td align="center">r/w</td>
            <td align="center">Yes</td>
            <td align="center">No</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>/data/data/{'<app-id>'}/files/Documents</td>
            <td></td>
            <td>documents</td>
            <td align="center"></td>
            <td></td>
            <td></td>
            <td>new File(context.getFilesDir(), “Documents”)</td>
            <td align="center">r/w</td>
            <td align="center">Yes</td>
            <td align="center">No</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>
              <sdcard>/</sdcard>
            </td>
            <td>externalRootDirectory</td>
            <td>sdcard</td>
            <td align="center">EXTERNAL_STORAGE</td>
            <td>Yes</td>
            <td>Generally no access. Only acess files the app created</td>
            <td>Environment.getExternalStorageDirectory()</td>
            <td align="center">r/w</td>
            <td align="center">Yes</td>
            <td align="center">No</td>
            <td align="center">No</td>
          </tr>
          <tr>
            <td>
              <sdcard>/Android/data/{'<app-id>'}/</sdcard>
            </td>
            <td>externalApplicationStorageDirectory</td>
            <td>-</td>
            <td align="center"></td>
            <td></td>
            <td></td>
            <td>context.getExternalFilesDir(null).getParentFile()</td>
            <td align="center">r/w</td>
            <td align="center">Yes</td>
            <td align="center">No</td>
            <td align="center">No</td>
          </tr>
          <tr>
            <td>
              <sdcard>/Android/data/{'<app-id>'}/cache</sdcard>
            </td>
            <td>externalCacheDirectory</td>
            <td>cache-external</td>
            <td align="center"></td>
            <td></td>
            <td></td>
            <td>context.getExternalCacheDir()</td>
            <td align="center">r/w</td>
            <td align="center">Yes</td>
            <td align="center">No**</td>
            <td align="center">No</td>
          </tr>
          <tr>
            <td>
              <sdcard>/Android/data/{'<app-id>'}/files</sdcard>
            </td>
            <td>externalDataDirectory</td>
            <td>files-external</td>
            <td align="center">EXTERNAL</td>
            <td></td>
            <td></td>
            <td>context.getExternalFilesDir(null)</td>
            <td align="center">r/w</td>
            <td align="center">Yes</td>
            <td align="center">No</td>
            <td align="center">No</td>
          </tr>
          <tr>
            <td>
              <sdcard>/Documents</sdcard>
            </td>
            <td></td>
            <td></td>
            <td align="center">DOCUMENTS</td>
            <td>Yes</td>
            <td>Generally no access. Only acess files the app created</td>
            <td>
              Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS)
            </td>
            <td align="center"></td>
            <td align="center"></td>
            <td align="center"></td>
            <td align="center"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export const IosTable = () => {
  return (
    <div class={CLASSES}>
      <table>
        <thead>
          <tr>
            <th>Device Path</th>
            <th>cordova.file.*</th>
            <th>iosExtraFileSystems</th>
            <th align="center">Capacitor</th>
            <th align="center">FileManager.SearchPathDirectory</th>
            <th align="center">r/w?</th>
            <th align="center">persistent?</th>
            <th align="center">OS clears</th>
            <th align="center">sync</th>
            <th align="center">private</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>/var/mobile/Applications/{'<uuid>'}/</td>
            <td>applicationStorageDirectory</td>
            <td>-</td>
            <td align="center"></td>
            <td align="center"></td>
            <td align="center">r</td>
            <td align="center">N/A</td>
            <td align="center">N/A</td>
            <td align="center">N/A</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>/var/mobile/Applications/{'<uuid>'}/appname.app/</td>
            <td>applicationDirectory</td>
            <td>bundle</td>
            <td align="center"></td>
            <td align="center"></td>
            <td align="center">r</td>
            <td align="center">N/A</td>
            <td align="center">N/A</td>
            <td align="center">N/A</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>/var/mobile/Applications/{'<uuid>'}/appname.app/www/</td>
            <td>-</td>
            <td>-</td>
            <td align="center"></td>
            <td align="center"></td>
            <td align="center">r</td>
            <td align="center">N/A</td>
            <td align="center">N/A</td>
            <td align="center">N/A</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>/var/mobile/Applications/{'<uuid>'}/Documents/</td>
            <td>documentsDirectory</td>
            <td>documents</td>
            <td align="center">DOCUMENTS, DATA, EXTERNAL, EXTERNAL_STORAGE</td>
            <td align="center">.documentDirectory</td>
            <td align="center">r/w</td>
            <td align="center">Yes</td>
            <td align="center">No</td>
            <td align="center">Yes</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>/var/mobile/Applications/{'<uuid>'}/Documents/NoCloud/</td>
            <td>-</td>
            <td>documents-nosync</td>
            <td align="center"></td>
            <td align="center"></td>
            <td align="center">r/w</td>
            <td align="center">Yes</td>
            <td align="center">No</td>
            <td align="center">No</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>/var/mobile/Applications/{'<uuid>'}/Library/</td>
            <td>-</td>
            <td>library</td>
            <td align="center">LIBRARY</td>
            <td align="center">.libraryDirectory</td>
            <td align="center">r/w</td>
            <td align="center">Yes</td>
            <td align="center">No</td>
            <td align="center">Yes?</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>/var/mobile/Applications/{'<uuid>'}/Library/NoCloud/</td>
            <td>dataDirectory</td>
            <td>library-nosync</td>
            <td align="center"></td>
            <td align="center"></td>
            <td align="center">r/w</td>
            <td align="center">Yes</td>
            <td align="center">No</td>
            <td align="center">No</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>/var/mobile/Applications/{'<uuid>'}/Library/Cloud/</td>
            <td>syncedDataDirectory</td>
            <td>-</td>
            <td align="center"></td>
            <td align="center"></td>
            <td align="center">r/w</td>
            <td align="center">Yes</td>
            <td align="center">No</td>
            <td align="center">Yes</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>/var/mobile/Applications/{'<uuid>'}/Library/Caches/</td>
            <td>cacheDirectory</td>
            <td>cache</td>
            <td align="center">CACHE</td>
            <td align="center">.cachesDirectory</td>
            <td align="center">r/w</td>
            <td align="center">Yes*</td>
            <td align="center">Yes***</td>
            <td align="center">No</td>
            <td align="center">Yes</td>
          </tr>
          <tr>
            <td>/var/mobile/Applications/{'<uuid>'}/tmp/</td>
            <td>tempDirectory</td>
            <td>-</td>
            <td align="center"></td>
            <td align="center"></td>
            <td align="center">r/w</td>
            <td align="center">No**</td>
            <td align="center">Yes***</td>
            <td align="center">No</td>
            <td align="center">Yes</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
