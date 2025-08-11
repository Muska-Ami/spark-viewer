import {
    PlatformMetadata,
    PlatformStatistics as PlatformStatisticsProto,
    SamplerMetadata_SamplerEngine,
    SystemStatistics as SystemStatisticsProto,
} from '../../../proto/spark_pb';
import { formatDuration } from '../../util/format';

export interface PlatformStatisticsProps {
    platform: PlatformMetadata;
    platformStatistics: PlatformStatisticsProto;
    systemStatistics?: SystemStatisticsProto;
    platformType: string;
    onlineMode?: string;
    runningTime?: number;
    numberOfTicks?: number;
    numberOfIncludedTicks?: number;
    engine?: SamplerMetadata_SamplerEngine;
}

export default function PlatformStatistics({
    platform,
    platformStatistics,
    systemStatistics,
    platformType,
    onlineMode,
    runningTime,
    numberOfTicks,
    numberOfIncludedTicks,
    engine,
}: PlatformStatisticsProps) {
    return (
        <>
            <p>
                The {platformType === 'application' ? 'system' : 'platform'} is
                a <span>{platform.brand || platform.name}</span> {platformType}{' '}
                running {platformType === 'application' ? 'spark' : ''} version
                &quot;
                <span>{platform.version}</span>&quot;.
            </p>
            {platform.minecraftVersion && (
                <p>
                    The detected Minecraft version is &quot;
                    <span>{platform.minecraftVersion}</span>&quot;.
                </p>
            )}
            {onlineMode && (
                <p>
                    The {platformType} is running in <span>{onlineMode}</span>.
                </p>
            )}
            {platformStatistics?.playerCount > 0 && (
                <p>
                    The {platformType} had a player count of{' '}
                    <span>{platformStatistics.playerCount}</span> when the
                    profile completed.
                </p>
            )}
            {!!systemStatistics && (
                <SystemStatistics systemStatistics={systemStatistics} />
            )}
            {runningTime && (
                <p>
                    The profiler{' '}
                    {engine ? (
                        <>
                            (engine{' '}
                            <span>
                                {engine == SamplerMetadata_SamplerEngine.ASYNC
                                    ? 'async'
                                    : 'java'}
                            </span>
                            ){' '}
                        </>
                    ) : (
                        ''
                    )}
                    was running for <span>{formatDuration(runningTime)}</span>
                    {!!numberOfTicks && (
                        <>
                            {' '}
                            (<span>{numberOfTicks}</span> ticks)
                        </>
                    )}
                    .
                    {!!numberOfIncludedTicks && (
                        <>
                            {' '}
                            <span>{numberOfIncludedTicks}</span> ticks exceeded
                            the &#39;only ticks over&#39; threshold.
                        </>
                    )}
                </p>
            )}
        </>
    );
}

interface SystemStatisticsProps {
    systemStatistics: SystemStatisticsProto;
}

const SystemStatistics = ({ systemStatistics }: SystemStatisticsProps) => {
    return (
        <>
            <p>
                The system is running <span>{systemStatistics.os!.name}</span> (
                <span>{systemStatistics.os!.arch}</span>) version &quot;
                <span>{systemStatistics.os!.version}</span>&quot; and has{' '}
                <span>{systemStatistics.cpu!.threads}</span> CPU threads
                available.
            </p>
            {systemStatistics.cpu!.modelName && (
                <p>
                    The CPU is described as an{' '}
                    <span>{systemStatistics.cpu!.modelName}</span>.
                </p>
            )}
            <p>
                The process is using Java{' '}
                <span>{systemStatistics.java!.version}</span> (
                <span>{systemStatistics.java!.vendorVersion}</span> from{' '}
                <span>{systemStatistics.java!.vendor}</span>).
                {systemStatistics.jvm?.name && (
                    <>
                        {' '}
                        The JVM is a <span>{systemStatistics.jvm?.name}</span>.
                    </>
                )}
            </p>
            <p>
                The current process uptime is{' '}
                <span>{formatDuration(systemStatistics.uptime)}</span>.
            </p>
        </>
    );
};
