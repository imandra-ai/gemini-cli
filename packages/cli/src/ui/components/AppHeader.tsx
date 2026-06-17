/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Text } from 'ink';
import { UserIdentity } from './UserIdentity.js';
import { Tips } from './Tips.js';
import { useSettings } from '../contexts/SettingsContext.js';
import { useConfig } from '../contexts/ConfigContext.js';
import { useUIState } from '../contexts/UIStateContext.js';
import { Banner } from './Banner.js';
import { useBanner } from '../hooks/useBanner.js';
import { useTips } from '../hooks/useTips.js';
import { theme } from '../semantic-colors.js';
import Gradient from 'ink-gradient';
import { CliSpinner } from './CliSpinner.js';

import { longAsciiLogo, shortAsciiLogo, tinyAsciiLogo } from './AsciiArt.js';
import { getAsciiArtWidth } from '../utils/textUtils.js';

interface AppHeaderProps {
  version: string;
  showDetails?: boolean;
}

/**
 * Imandra-ish teal-green gradient for the CodeLogician banner (light teal →
 * emerald → deep green), applied left-to-right across the ASCII art.
 */
const CODELOGICIAN_GRADIENT = ['#5eead4', '#10b981', '#047857'];

export const AppHeader = ({ version, showDetails = true }: AppHeaderProps) => {
  const settings = useSettings();
  const config = useConfig();
  const { terminalWidth, bannerData, bannerVisible, updateInfo } = useUIState();

  const { bannerText } = useBanner(bannerData);
  const { showTips } = useTips();

  const showHeader = !(
    settings.merged.ui.hideBanner || config.getScreenReader()
  );

  // Pick the widest "CodeLogician" banner that fits the terminal: solid block
  // when wide, the full word when medium, and a "CL" monogram when narrow.
  const widthOfLong = getAsciiArtWidth(longAsciiLogo);
  const widthOfShort = getAsciiArtWidth(shortAsciiLogo);
  const bannerArt =
    terminalWidth >= widthOfLong
      ? longAsciiLogo
      : terminalWidth >= widthOfShort
        ? shortAsciiLogo
        : tinyAsciiLogo;

  const renderLogo = () => (
    <Box flexShrink={0}>
      <Gradient colors={CODELOGICIAN_GRADIENT}>
        <Text>{bannerArt}</Text>
      </Gradient>
    </Box>
  );

  const renderMetadata = (isBelow = false) => (
    <Box marginLeft={isBelow ? 0 : 2} flexDirection="column">
      {/* Line 1: CodeLogician Agent vVersion [Updating] */}
      <Box>
        <Text bold color={theme.text.primary}>
          CodeLogician Agent
        </Text>
        <Text color={theme.text.secondary}> v{version}</Text>
        {updateInfo?.isUpdating && (
          <Box marginLeft={2}>
            <Text color={theme.text.secondary}>
              <CliSpinner /> Updating
            </Text>
          </Box>
        )}
      </Box>

      {showDetails && (
        <>
          {/* Line 2: Blank */}
          <Box height={1} />

          {/* Lines 3 & 4: User Identity info (Email /auth and Plan /upgrade) */}
          {settings.merged.ui.showUserIdentity !== false && (
            <UserIdentity config={config} />
          )}
        </>
      )}
    </Box>
  );

  return (
    <Box flexDirection="column">
      {showHeader && (
        <Box
          flexDirection="column"
          marginTop={1}
          marginBottom={1}
          paddingLeft={1}
        >
          {renderLogo()}
          <Box marginTop={1}>{renderMetadata(true)}</Box>
        </Box>
      )}

      {bannerVisible && bannerText && (
        <Banner
          width={terminalWidth}
          bannerText={bannerText}
          isWarning={bannerData.warningText !== ''}
        />
      )}

      {!(settings.merged.ui.hideTips || config.getScreenReader()) &&
        showTips && <Tips config={config} />}
    </Box>
  );
};
